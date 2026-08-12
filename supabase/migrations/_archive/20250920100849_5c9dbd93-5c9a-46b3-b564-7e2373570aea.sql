-- Add temporary access table for reward ads
CREATE TABLE public.temporary_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  features JSONB NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  granted_via TEXT NOT NULL, -- 'reward_ad', 'promotion', 'trial'
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.temporary_access ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own temporary access" 
ON public.temporary_access 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to check temporary access
CREATE OR REPLACE FUNCTION public.has_temporary_access(
  user_uuid UUID, 
  feature_name TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.temporary_access ta
    WHERE ta.user_id = user_uuid 
      AND ta.expires_at > NOW()
      AND ta.features ? feature_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the check_usage_limit function to consider temporary access
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
  has_temp_access BOOLEAN;
BEGIN
  -- Check for temporary access first
  has_temp_access := public.has_temporary_access(user_uuid, feature);
  IF has_temp_access THEN
    RETURN TRUE;
  END IF;

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