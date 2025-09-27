-- Fix search_path security issues for database functions
-- This adds SET search_path = 'public' to functions that are missing it

-- Fix increment_usage function
CREATE OR REPLACE FUNCTION public.increment_usage(user_uuid uuid, feature text, period text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix check_usage_limit function
CREATE OR REPLACE FUNCTION public.check_usage_limit(user_uuid uuid, feature text, period text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix has_temporary_access function
CREATE OR REPLACE FUNCTION public.has_temporary_access(user_uuid uuid, feature_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.temporary_access ta
    WHERE ta.user_id = user_uuid 
      AND ta.expires_at > NOW()
      AND ta.features ? feature_name
  );
END;
$function$;