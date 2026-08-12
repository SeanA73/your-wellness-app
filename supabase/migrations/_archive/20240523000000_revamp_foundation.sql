-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_calories DECIMAL(6,2),
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fats_g DECIMAL(6,2),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB, -- dietary restrictions, allergies, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plan_items table
CREATE TABLE IF NOT EXISTS public.meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID, -- Will reference recipes table after it's created
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  serving_size DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  cuisine_type TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
  
  -- Nutrition per serving
  calories_per_serving DECIMAL(6,2),
  protein_per_serving DECIMAL(5,2),
  carbs_per_serving DECIMAL(5,2),
  fats_per_serving DECIMAL(5,2),
  fiber_per_serving DECIMAL(5,2),
  
  ingredients JSONB NOT NULL, -- [{name, amount, unit}, ...]
  instructions JSONB NOT NULL, -- ["step 1", "step 2", ...]
  
  image_urls TEXT[],
  video_url TEXT,
  tags TEXT[],
  
  created_by UUID REFERENCES public.profiles(id),
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to meal_plan_items
ALTER TABLE public.meal_plan_items 
ADD CONSTRAINT fk_meal_plan_items_recipe 
FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL, -- 'free_weight', 'cardio', 'bodyweight', etc.
  workout_name TEXT NOT NULL,
  
  -- Duration & Intensity
  duration_minutes INTEGER,
  calories_burned INTEGER,
  perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
  
  -- Location & Notes
  location TEXT, -- 'gym', 'home', 'outdoor'
  notes TEXT,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  
  -- Relationships
  -- workout_program_id UUID REFERENCES workout_programs(id), -- Assuming workout_programs exists or will be created. Commenting out if not sure.
  -- workout_day_id UUID,
  
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise_logs table
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID, -- reference to exercise library
  
  exercise_name TEXT NOT NULL,
  exercise_type TEXT, -- 'strength', 'cardio', 'flexibility'
  
  -- Sets data
  sets JSONB NOT NULL, -- [{set_number, reps, weight, rest_seconds, completed}, ...]
  total_volume DECIMAL(8,2), -- calculated: sum(reps * weight)
  estimated_1rm DECIMAL(6,2),
  
  duration_seconds INTEGER,
  distance_meters DECIMAL(8,2), -- for cardio
  
  rest_between_sets INTEGER, -- seconds
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10), -- rate of perceived exertion
  
  notes TEXT,
  order_index INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_reports table
CREATE TABLE IF NOT EXISTS public.progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  report_type TEXT NOT NULL, -- 'weekly', 'monthly', 'goal_completion'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Workout stats
  total_workouts INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2),
  avg_rpe DECIMAL(4,2),
  
  -- Nutrition stats
  avg_daily_calories DECIMAL(8,2),
  avg_daily_protein DECIMAL(8,2),
  avg_daily_carbs DECIMAL(8,2),
  avg_daily_fats DECIMAL(8,2),
  macro_adherence_percentage DECIMAL(5,2),
  
  -- Wellness stats
  avg_mood DECIMAL(4,2),
  avg_energy DECIMAL(4,2),
  avg_sleep_quality DECIMAL(4,2),
  avg_stress DECIMAL(4,2),
  
  -- Goals progress
  goals_achieved INTEGER DEFAULT 0,
  goals_total INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  
  -- Analysis
  insights JSONB, -- AI-generated insights
  recommendations JSONB, -- AI-generated recommendations
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  notification_type TEXT NOT NULL, -- 'workout_reminder', 'meal_time', 'hydration', 'goal_checkin', 'streak', 'system'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  
  -- Action data
  action_url TEXT, -- deep link
  action_text TEXT, -- button text
  action_data JSONB,
  
  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  generated_from UUID, -- meal_plan_id or recipe_id
  
  items JSONB NOT NULL, -- [{name, quantity, unit, category, is_purchased}, ...]
  
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}'::jsonb;

-- Enable Row Level Security (RLS)
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Basic: Users can only see/edit their own data)

-- meal_plans
CREATE POLICY "Users can view their own meal plans" ON public.meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans" ON public.meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" ON public.meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans" ON public.meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- meal_plan_items (via meal_plan_id)
CREATE POLICY "Users can view their own meal plan items" ON public.meal_plan_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own meal plan items" ON public.meal_plan_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own meal plan items" ON public.meal_plan_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own meal plan items" ON public.meal_plan_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
  );

-- recipes
CREATE POLICY "Recipes are viewable by everyone if public, or by creator" ON public.recipes
  FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can insert their own recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own recipes" ON public.recipes
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own recipes" ON public.recipes
  FOR DELETE USING (auth.uid() = created_by);

-- workout_logs
CREATE POLICY "Users can view their own workout logs" ON public.workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" ON public.workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" ON public.workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs" ON public.workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- exercise_logs (via workout_log_id)
CREATE POLICY "Users can view their own exercise logs" ON public.exercise_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = exercise_logs.workout_log_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own exercise logs" ON public.exercise_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = exercise_logs.workout_log_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own exercise logs" ON public.exercise_logs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = exercise_logs.workout_log_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own exercise logs" ON public.exercise_logs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workout_logs WHERE id = exercise_logs.workout_log_id AND user_id = auth.uid())
  );

-- progress_reports
CREATE POLICY "Users can view their own progress reports" ON public.progress_reports
  FOR SELECT USING (auth.uid() = user_id);

-- user_notifications
CREATE POLICY "Users can view their own notifications" ON public.user_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- shopping_lists
CREATE POLICY "Users can view their own shopping lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" ON public.shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" ON public.shopping_lists
  FOR DELETE USING (auth.uid() = user_id);
