-- Subscription management
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'pro')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking for tier limitations
CREATE TABLE public.usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'workout_track', 'ai_interaction', 'group_class'
  usage_count INTEGER DEFAULT 0,
  reset_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad interaction tracking
CREATE TABLE public.ad_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ad_type TEXT NOT NULL, -- 'banner', 'native', 'reward_video', 'sponsored_content'
  ad_placement TEXT NOT NULL, -- 'workout_rest', 'nutrition_tip', 'recipe_suggestion'
  interaction_type TEXT NOT NULL, -- 'view', 'click', 'dismiss', 'complete'
  ad_provider TEXT DEFAULT 'adsense',
  revenue_cents INTEGER, -- Track estimated revenue
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue analytics
CREATE TABLE public.revenue_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  event_type TEXT NOT NULL, -- 'subscription_start', 'subscription_cancel', 'ad_revenue', 'upgrade'
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  platform TEXT, -- 'stripe', 'adsense', 'app_store'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature usage limits
CREATE TABLE public.plan_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_type TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  limit_value INTEGER, -- NULL means unlimited
  limit_period TEXT, -- 'daily', 'weekly', 'monthly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_type, feature_name)
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for usage tracking
CREATE POLICY "Users can manage their own usage tracking" 
ON public.usage_tracking 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for ad interactions
CREATE POLICY "Users can manage their own ad interactions" 
ON public.ad_interactions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for revenue events
CREATE POLICY "Users can view their own revenue events" 
ON public.revenue_events 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for plan limits (readable by all authenticated users)
CREATE POLICY "Plan limits are readable by authenticated users" 
ON public.plan_limits 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Insert default plan limits
INSERT INTO public.plan_limits (plan_type, feature_name, limit_value, limit_period) VALUES
('free', 'workouts_per_week', 3, 'weekly'),
('free', 'ai_interactions_per_day', 3, 'daily'),
('free', 'group_classes_per_week', 2, 'weekly'),
('premium', 'workouts_per_week', NULL, NULL),
('premium', 'ai_interactions_per_day', NULL, NULL),
('premium', 'group_classes_per_week', NULL, NULL),
('pro', 'coaching_sessions_per_month', 2, 'monthly');

-- Add subscription plan to profiles table
ALTER TABLE public.profiles ADD COLUMN subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'pro'));

-- Create function to get user's current plan
CREATE OR REPLACE FUNCTION public.get_user_plan(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT plan_type FROM public.subscriptions 
     WHERE user_id = user_uuid AND status = 'active' 
     ORDER BY created_at DESC LIMIT 1),
    'free'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  user_uuid UUID, 
  feature TEXT, 
  period TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  limit_value INTEGER;
  current_usage INTEGER;
  period_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user's current plan
  user_plan := public.get_user_plan(user_uuid);
  
  -- Get the limit for this feature and plan
  SELECT pl.limit_value INTO limit_value
  FROM public.plan_limits pl
  WHERE pl.plan_type = user_plan 
    AND pl.feature_name = feature;
  
  -- If no limit (NULL), return true (unlimited)
  IF limit_value IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate period start based on period type
  CASE period
    WHEN 'daily' THEN
      period_start := date_trunc('day', NOW());
    WHEN 'weekly' THEN
      period_start := date_trunc('week', NOW());
    WHEN 'monthly' THEN
      period_start := date_trunc('month', NOW());
    ELSE
      period_start := NOW() - INTERVAL '1 day';
  END CASE;
  
  -- Get current usage for this period
  SELECT COALESCE(SUM(ut.usage_count), 0) INTO current_usage
  FROM public.usage_tracking ut
  WHERE ut.user_id = user_uuid 
    AND ut.feature_type = feature
    AND ut.period_start >= period_start;
  
  -- Return true if under limit
  RETURN current_usage < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  user_uuid UUID, 
  feature TEXT, 
  period TEXT
)
RETURNS VOID AS $$
DECLARE
  period_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate period start based on period type
  CASE period
    WHEN 'daily' THEN
      period_start := date_trunc('day', NOW());
    WHEN 'weekly' THEN
      period_start := date_trunc('week', NOW());
    WHEN 'monthly' THEN
      period_start := date_trunc('month', NOW());
    ELSE
      period_start := NOW();
  END CASE;
  
  -- Insert or update usage tracking
  INSERT INTO public.usage_tracking (user_id, feature_type, usage_count, reset_period, period_start)
  VALUES (user_uuid, feature, 1, period, period_start)
  ON CONFLICT (user_id, feature_type, period_start) 
  DO UPDATE SET 
    usage_count = usage_tracking.usage_count + 1,
    last_reset = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for updating subscription plan in profiles
CREATE OR REPLACE FUNCTION public.update_profile_subscription_plan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET subscription_plan = NEW.plan_type
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_profile_plan_trigger
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_subscription_plan();