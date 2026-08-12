-- Create affiliate products table
CREATE TABLE public.affiliate_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price_cents INTEGER NOT NULL,
  original_price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',
  affiliate_url TEXT NOT NULL,
  affiliate_network TEXT NOT NULL DEFAULT 'custom',
  commission_rate NUMERIC(5,2),
  image_url TEXT,
  additional_images JSONB DEFAULT '[]'::jsonb,
  brand TEXT,
  rating NUMERIC(3,2),
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_status TEXT DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view products
CREATE POLICY "Products are viewable by everyone"
  ON public.affiliate_products
  FOR SELECT
  USING (is_active = true);

-- Create affiliate clicks tracking table
CREATE TABLE public.affiliate_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  session_id UUID,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  referrer_page TEXT,
  user_agent TEXT,
  converted BOOLEAN DEFAULT false,
  conversion_amount_cents INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Users can view their own clicks
CREATE POLICY "Users can view their own clicks"
  ON public.affiliate_clicks
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can insert clicks (for tracking)
CREATE POLICY "Anyone can track clicks"
  ON public.affiliate_clicks
  FOR INSERT
  WITH CHECK (true);

-- Create product categories reference
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  parent_category_id UUID REFERENCES public.product_categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view active categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.product_categories
  FOR SELECT
  USING (is_active = true);

-- Update timestamp trigger
CREATE TRIGGER update_affiliate_products_updated_at
  BEFORE UPDATE ON public.affiliate_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample product categories
INSERT INTO public.product_categories (name, slug, description, icon, display_order) VALUES
  ('Fitness Equipment', 'fitness-equipment', 'Workout gear and exercise equipment', '🏋️', 1),
  ('Supplements', 'supplements', 'Nutritional supplements and vitamins', '💊', 2),
  ('Apparel', 'apparel', 'Workout clothes and activewear', '👕', 3),
  ('Accessories', 'accessories', 'Fitness accessories and gadgets', '⌚', 4),
  ('Recovery', 'recovery', 'Recovery and wellness products', '🧘', 5),
  ('Nutrition', 'nutrition', 'Healthy food and meal prep', '🥗', 6);

-- Insert sample affiliate products
INSERT INTO public.affiliate_products (name, description, short_description, category, subcategory, price_cents, original_price_cents, affiliate_url, image_url, brand, rating, review_count, tags, features, is_featured) VALUES
  ('Premium Resistance Bands Set', 'Complete resistance band set with 5 different resistance levels. Perfect for home workouts, stretching, and strength training. Includes door anchor, handles, and ankle straps.', 'Professional resistance bands for all fitness levels', 'Fitness Equipment', 'Strength Training', 2999, 4999, 'https://example.com/resistance-bands', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', 'FitPro', 4.8, 1247, ARRAY['home workout', 'portable', 'full body'], '["5 resistance levels", "Lifetime warranty", "Includes travel bag", "Door anchor included"]'::jsonb, true),
  
  ('Whey Protein Isolate - Vanilla', 'Ultra-pure whey protein isolate with 25g protein per serving. Zero sugar, low carb, and easily digestible. Perfect for post-workout recovery and muscle building.', 'Premium protein powder for muscle recovery', 'Supplements', 'Protein', 4999, 6999, 'https://example.com/whey-protein', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800', 'NutriFit', 4.9, 3421, ARRAY['protein', 'recovery', 'muscle building'], '["25g protein per serving", "Zero sugar", "Grass-fed whey", "Delicious vanilla flavor"]'::jsonb, true),
  
  ('Smart Fitness Watch', 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 30+ sport modes. Water-resistant with 7-day battery life.', 'Track your fitness journey with precision', 'Accessories', 'Wearables', 19999, 29999, 'https://example.com/fitness-watch', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', 'TechFit', 4.7, 892, ARRAY['tracking', 'heart rate', 'GPS'], '["Heart rate monitoring", "GPS tracking", "7-day battery", "Water resistant"]'::jsonb, true),
  
  ('Yoga Mat Premium', 'Extra thick 6mm yoga mat with superior cushioning and grip. Non-slip surface, eco-friendly materials. Perfect for yoga, pilates, and floor exercises.', 'Premium yoga mat for ultimate comfort', 'Fitness Equipment', 'Yoga', 3999, 5999, 'https://example.com/yoga-mat', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 'ZenFlow', 4.6, 2156, ARRAY['yoga', 'eco-friendly', 'non-slip'], '["6mm thickness", "Non-slip surface", "Eco-friendly materials", "Includes carrying strap"]'::jsonb, false),
  
  ('Adjustable Dumbbells 50lbs', 'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick-change weight system from 5-50 lbs. Perfect for home gyms.', 'Complete dumbbell set in one', 'Fitness Equipment', 'Strength Training', 29999, 39999, 'https://example.com/dumbbells', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'PowerLift', 4.9, 1687, ARRAY['strength', 'home gym', 'adjustable'], '["5-50 lbs range", "Quick-change system", "Compact design", "Heavy-duty construction"]'::jsonb, true),
  
  ('Performance Workout Leggings', 'High-waisted leggings with moisture-wicking fabric and four-way stretch. Squat-proof and perfect for any workout. Available in multiple colors.', 'Comfortable leggings for any workout', 'Apparel', 'Bottoms', 4999, 7999, 'https://example.com/leggings', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', 'ActiveWear', 4.8, 5432, ARRAY['workout clothes', 'leggings', 'women'], '["High-waisted design", "Moisture-wicking", "Four-way stretch", "Squat-proof"]'::jsonb, false),
  
  ('Foam Roller Pro', 'High-density foam roller for deep tissue massage and muscle recovery. Textured surface for targeted relief. Perfect for post-workout recovery.', 'Professional foam roller for recovery', 'Recovery', 'Massage', 2499, 3999, 'https://example.com/foam-roller', 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800', 'RecoveryMax', 4.7, 1891, ARRAY['recovery', 'massage', 'foam rolling'], '["High-density foam", "Textured surface", "18-inch length", "Includes guide"]'::jsonb, false),
  
  ('Pre-Workout Energy Boost', 'Clean energy pre-workout formula with natural caffeine, beta-alanine, and amino acids. Sugar-free with fruit punch flavor.', 'Natural energy for intense workouts', 'Supplements', 'Pre-Workout', 3999, 4999, 'https://example.com/pre-workout', 'https://images.unsplash.com/photo-1594737625785-8e6c1e00b15e?w=800', 'EnergyFuel', 4.6, 2341, ARRAY['energy', 'pre-workout', 'supplements'], '["Natural caffeine", "Beta-alanine formula", "Sugar-free", "Great taste"]'::jsonb, false);