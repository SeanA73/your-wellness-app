-- Ensure profiles table has all necessary fields with proper constraints
-- This is an additive migration - it will only add missing fields

-- Add any missing columns (these will be ignored if they already exist)
DO $$ 
BEGIN
    -- Add date_of_birth if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.profiles ADD COLUMN date_of_birth DATE;
    END IF;
    
    -- Add gender if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'gender') THEN
        ALTER TABLE public.profiles ADD COLUMN gender TEXT;
    END IF;
    
    -- Add height_cm if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'height_cm') THEN
        ALTER TABLE public.profiles ADD COLUMN height_cm INTEGER;
    END IF;
    
    -- Add weight_kg if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'weight_kg') THEN
        ALTER TABLE public.profiles ADD COLUMN weight_kg NUMERIC(5,2);
    END IF;
    
    -- Add activity_level if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'activity_level') THEN
        ALTER TABLE public.profiles ADD COLUMN activity_level TEXT;
    END IF;
    
    -- Add fitness_goals if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fitness_goals') THEN
        ALTER TABLE public.profiles ADD COLUMN fitness_goals TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add health_conditions if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'health_conditions') THEN
        ALTER TABLE public.profiles ADD COLUMN health_conditions TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add avatar_url if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Add constraints for data validation (drop first if exists to avoid conflicts)
DO $$
BEGIN
    -- Gender constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_gender_check') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_gender_check 
        CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say') OR gender IS NULL);
    END IF;
    
    -- Activity level constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_activity_level_check') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_activity_level_check 
        CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') OR activity_level IS NULL);
    END IF;
    
    -- Height constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_height_check') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_height_check 
        CHECK (height_cm > 0 AND height_cm < 300 OR height_cm IS NULL);
    END IF;
    
    -- Weight constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_weight_check') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_weight_check 
        CHECK (weight_kg > 0 AND weight_kg < 1000 OR weight_kg IS NULL);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_activity_level ON public.profiles(activity_level);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON public.profiles(subscription_plan);

-- Update the trigger to ensure updated_at is maintained
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();