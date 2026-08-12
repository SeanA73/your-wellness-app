-- Product Recommendations Engine
-- This migration adds tables for AI-powered product recommendations

-- Table to store product recommendations for users
CREATE TABLE public.product_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  
  -- Recommendation metadata
  recommendation_reason TEXT NOT NULL, -- Why this product was recommended
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1), -- AI confidence (0-1)
  recommendation_context TEXT, -- Context: 'workout_planning', 'post_workout', 'goal_based', etc.
  
  -- AI analysis data
  user_workout_patterns JSONB DEFAULT '{}', -- Workout types, frequency, etc.
  user_goals_alignment JSONB DEFAULT '{}', -- How product aligns with goals
  user_preferences_match JSONB DEFAULT '{}', -- Preference matching data
  
  -- Display and interaction tracking
  displayed_at TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  purchased BOOLEAN DEFAULT false,
  
  -- Priority and ordering
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

-- Users can view their own recommendations
CREATE POLICY "Users can view their own recommendations"
  ON public.product_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own recommendations (for clicks, dismissals)
CREATE POLICY "Users can update their own recommendations"
  ON public.product_recommendations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can insert recommendations (via Edge Function)
CREATE POLICY "Service can insert recommendations"
  ON public.product_recommendations
  FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_product_recommendations_user_id ON public.product_recommendations(user_id);
CREATE INDEX idx_product_recommendations_product_id ON public.product_recommendations(product_id);
CREATE INDEX idx_product_recommendations_context ON public.product_recommendations(recommendation_context);
CREATE INDEX idx_product_recommendations_displayed ON public.product_recommendations(displayed_at DESC);
CREATE INDEX idx_product_recommendations_priority ON public.product_recommendations(priority DESC, display_order);

-- Table to store recommendation feedback
CREATE TABLE public.recommendation_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES public.product_recommendations(id) ON DELETE CASCADE,
  
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('helpful', 'not_helpful', 'already_own', 'wrong_category', 'too_expensive', 'other')),
  feedback_text TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own feedback"
  ON public.recommendation_feedback
  FOR ALL
  USING (auth.uid() = user_id);

-- Table to store AI recommendation generation history
CREATE TABLE public.recommendation_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  generation_context TEXT NOT NULL, -- Context for this generation
  products_analyzed INTEGER DEFAULT 0,
  recommendations_created INTEGER DEFAULT 0,
  
  -- AI model info
  ai_model TEXT, -- 'openai-gpt-4', 'anthropic-claude', 'rule-based', etc.
  generation_time_ms INTEGER,
  
  -- Input data snapshot
  user_profile_snapshot JSONB DEFAULT '{}',
  workout_history_snapshot JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recommendation_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation history"
  ON public.recommendation_generations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert generation history"
  ON public.recommendation_generations
  FOR INSERT
  WITH CHECK (true);

-- Index
CREATE INDEX idx_recommendation_generations_user_id ON public.recommendation_generations(user_id);
CREATE INDEX idx_recommendation_generations_created ON public.recommendation_generations(created_at DESC);

-- Function to update updated_at timestamp
CREATE TRIGGER update_product_recommendations_updated_at
  BEFORE UPDATE ON public.product_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- View for active recommendations (not dismissed, not purchased)
CREATE OR REPLACE VIEW public.active_product_recommendations AS
SELECT 
  pr.*,
  ap.name as product_name,
  ap.short_description as product_description,
  ap.price_cents,
  ap.image_url,
  ap.brand,
  ap.rating,
  ap.review_count,
  ap.affiliate_url,
  ap.category,
  ap.subcategory
FROM public.product_recommendations pr
JOIN public.affiliate_products ap ON pr.product_id = ap.id
WHERE 
  pr.dismissed = false 
  AND pr.purchased = false
  AND ap.is_active = true;

-- Enable RLS on view
ALTER VIEW public.active_product_recommendations SET (security_invoker = true);



