-- Insert test user data directly into profiles table
INSERT INTO public.profiles (id, full_name, email, subscription_plan) VALUES
  (gen_random_uuid(), 'John Free', 'john.free@test.com', 'free'),
  (gen_random_uuid(), 'Jane Premium', 'jane.premium@test.com', 'premium'),
  (gen_random_uuid(), 'Mike Pro', 'mike.pro@test.com', 'pro'),
  (gen_random_uuid(), 'Admin User', 'admin@fitmate.com', 'pro');

-- Insert corresponding subscriptions for premium and pro users
INSERT INTO public.subscriptions (user_id, plan_type, status, current_period_start, current_period_end)
SELECT 
  p.id,
  p.subscription_plan,
  'active',
  NOW(),
  NOW() + INTERVAL '1 month'
FROM public.profiles p 
WHERE p.subscription_plan IN ('premium', 'pro');