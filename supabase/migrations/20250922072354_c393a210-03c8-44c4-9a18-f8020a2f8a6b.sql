-- Create user roles enum and table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert test user profiles with different subscription plans
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    subscription_plan,
    fitness_goals,
    activity_level,
    gender,
    age,
    height_cm,
    weight_kg
) VALUES 
-- Free user
('550e8400-e29b-41d4-a716-446655440001', 'free.user@test.com', 'Free User', 'free', ARRAY['weight_loss'], 'moderate', 'male', 25, 175, 70),
-- Premium user  
('550e8400-e29b-41d4-a716-446655440002', 'premium.user@test.com', 'Premium User', 'premium', ARRAY['muscle_gain', 'strength'], 'high', 'female', 28, 165, 65),
-- Pro user
('550e8400-e29b-41d4-a716-446655440003', 'pro.user@test.com', 'Pro User', 'pro', ARRAY['athletic_performance'], 'very_high', 'male', 32, 180, 80),
-- Admin user
('550e8400-e29b-41d4-a716-446655440004', 'admin@test.com', 'Admin User', 'pro', ARRAY['general_fitness'], 'moderate', 'female', 30, 170, 60);

-- Insert corresponding subscriptions for premium and pro users
INSERT INTO public.subscriptions (
    id,
    user_id,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    stripe_customer_id,
    stripe_subscription_id
) VALUES 
-- Premium subscription
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'premium', 'active', NOW(), NOW() + INTERVAL '1 month', 'cus_premium_test', 'sub_premium_test'),
-- Pro subscription  
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'pro', 'active', NOW(), NOW() + INTERVAL '1 month', 'cus_pro_test', 'sub_pro_test'),
-- Admin subscription (pro level)
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'pro', 'active', NOW(), NOW() + INTERVAL '1 month', 'cus_admin_test', 'sub_admin_test');

-- Insert user roles (make admin user an admin)
INSERT INTO public.user_roles (user_id, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'user'),
('550e8400-e29b-41d4-a716-446655440002', 'user'), 
('550e8400-e29b-41d4-a716-446655440003', 'user'),
('550e8400-e29b-41d4-a716-446655440004', 'admin');

-- Insert user preferences for all test users
INSERT INTO public.user_preferences (user_id) VALUES
('550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440004');

-- Insert some sample usage tracking data
INSERT INTO public.usage_tracking (user_id, feature_type, usage_count, reset_period, period_start) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ai_coaching', 3, 'daily', date_trunc('day', NOW())),
('550e8400-e29b-41d4-a716-446655440001', 'nutrition_tracking', 5, 'daily', date_trunc('day', NOW())),
('550e8400-e29b-41d4-a716-446655440002', 'ai_coaching', 15, 'daily', date_trunc('day', NOW())),
('550e8400-e29b-41d4-a716-446655440003', 'ai_coaching', 25, 'daily', date_trunc('day', NOW()));

-- Insert sample wellness check-ins
INSERT INTO public.wellness_checkins (user_id, checked_in_at, mood_rating, energy_level, stress_level, sleep_quality, activities, notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day', 7, 6, 4, 7, '["walking", "meditation"]', 'Feeling good today'),
('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 day', 8, 8, 3, 8, '["weightlifting", "yoga"]', 'Great workout session'),
('550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '1 day', 9, 9, 2, 9, '["running", "swimming", "strength_training"]', 'Perfect training day');

-- Insert sample meals
INSERT INTO public.meals (user_id, meal_type, consumed_at, total_calories, macros, food_items, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'breakfast', NOW() - INTERVAL '2 hours', 450, '{"protein": 25, "carbs": 45, "fat": 15, "fiber": 8}', '[{"name": "Oatmeal with berries", "quantity": 1, "unit": "bowl"}]', 'Healthy breakfast'),
('550e8400-e29b-41d4-a716-446655440002', 'lunch', NOW() - INTERVAL '1 hour', 600, '{"protein": 40, "carbs": 50, "fat": 20, "fiber": 10}', '[{"name": "Grilled chicken salad", "quantity": 1, "unit": "plate"}]', 'Post-workout meal'),
('550e8400-e29b-41d4-a716-446655440003', 'dinner', NOW() - INTERVAL '30 minutes', 750, '{"protein": 50, "carbs": 60, "fat": 25, "fiber": 12}', '[{"name": "Salmon with quinoa", "quantity": 1, "unit": "serving"}]', 'High protein dinner');

-- Insert sample user goals
INSERT INTO public.user_goals (user_id, goal_type, target_value, current_value, unit, target_date, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'weight_loss', 5, 1.5, 'kg', NOW() + INTERVAL '3 months', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'muscle_gain', 3, 0.8, 'kg', NOW() + INTERVAL '6 months', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'strength', 150, 130, 'kg', NOW() + INTERVAL '4 months', 'active');