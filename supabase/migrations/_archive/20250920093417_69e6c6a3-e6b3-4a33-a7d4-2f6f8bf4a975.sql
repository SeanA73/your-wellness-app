-- Biometric data table for wearables integration
CREATE TABLE public.biometric_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    data_type TEXT NOT NULL, -- 'heart_rate', 'steps', 'sleep', 'weight', etc.
    value DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    source TEXT, -- 'manual', 'fitbit', 'apple_watch', etc.
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.biometric_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own biometric data" 
ON public.biometric_data 
FOR ALL 
USING (auth.uid() = user_id);

-- Mental wellness check-ins table
CREATE TABLE public.wellness_checkins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    notes TEXT,
    activities JSONB,
    checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.wellness_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wellness check-ins" 
ON public.wellness_checkins 
FOR ALL 
USING (auth.uid() = user_id);

-- AI coaching interactions table
CREATE TABLE public.coaching_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type TEXT,
    ai_message TEXT NOT NULL,
    user_response TEXT,
    context JSONB,
    sentiment_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.coaching_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own coaching interactions" 
ON public.coaching_interactions 
FOR ALL 
USING (auth.uid() = user_id);

-- User goals table
CREATE TABLE public.user_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals" 
ON public.user_goals 
FOR ALL 
USING (auth.uid() = user_id);

-- Food database for quick nutrition logging
CREATE TABLE public.food_database (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    serving_size TEXT,
    calories_per_serving INTEGER,
    macros JSONB,
    micronutrients JSONB,
    categories TEXT[],
    barcode TEXT UNIQUE,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food database is public readable for all users
ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Food database is readable by all authenticated users" 
ON public.food_database 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Function to automatically create user preferences when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences for new users
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample food items
INSERT INTO public.food_database (name, serving_size, calories_per_serving, macros, categories) VALUES
('Greek Yogurt', '1 cup (245g)', 130, '{"protein": 23, "carbs": 9, "fat": 0, "fiber": 0}', ARRAY['dairy', 'protein']),
('Banana', '1 medium (118g)', 105, '{"protein": 1, "carbs": 27, "fat": 0, "fiber": 3}', ARRAY['fruit']),
('Chicken Breast', '100g', 165, '{"protein": 31, "carbs": 0, "fat": 4, "fiber": 0}', ARRAY['protein', 'meat']),
('Brown Rice', '1 cup cooked (195g)', 216, '{"protein": 5, "carbs": 45, "fat": 2, "fiber": 4}', ARRAY['grain', 'carbs']),
('Spinach', '1 cup raw (30g)', 7, '{"protein": 1, "carbs": 1, "fat": 0, "fiber": 1}', ARRAY['vegetable', 'leafy-green']),
('Almonds', '1 oz (28g)', 164, '{"protein": 6, "carbs": 6, "fat": 14, "fiber": 4}', ARRAY['nuts', 'healthy-fat']),
('Avocado', '1 medium (150g)', 234, '{"protein": 3, "carbs": 12, "fat": 21, "fiber": 10}', ARRAY['fruit', 'healthy-fat']),
('Oatmeal', '1 cup cooked (234g)', 147, '{"protein": 6, "carbs": 25, "fat": 3, "fiber": 4}', ARRAY['grain', 'fiber']);