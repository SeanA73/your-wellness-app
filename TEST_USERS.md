# Test Users Guide

This guide explains how to create test users for FitMatePro.

## Quick Start

1. **Set up environment variables** (create `.env` file if needed):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Run the seed script**:
   ```bash
   npm run seed:users
   ```

3. **Sign in with test accounts**:
   - Free User: `free.user@test.com` / `TestUser123!`
   - Premium User: `premium.user@test.com` / `TestUser123!`
   - Admin: `admin@fitmatepro.com` / `Admin123!`

## Test Users Created

### Free User
- **Email**: `free.user@test.com`
- **Password**: `TestUser123!`
- **Subscription**: Free Plan
- **Features**: Basic workout tracking (3/week), AI coaching (3/day), Simple nutrition logging

### Premium User
- **Email**: `premium.user@test.com`
- **Password**: `TestUser123!`
- **Subscription**: Premium Plan (Active)
- **Features**: All premium features unlocked

### Admin User
- **Email**: `admin@fitmatepro.com`
- **Password**: `Admin123!`
- **Subscription**: Premium Plan (Active)
- **Role**: Administrator
- **Access**: All features + Admin Dashboard at `/admin`

### Admin User (Alternative)
- **Email**: `admin@test.com`
- **Password**: `Admin123!`
- **Subscription**: Premium Plan (Active)
- **Role**: Administrator

## Admin Dashboard

Admin users can access the admin dashboard at:
- **URL**: `/admin`
- **Features**: User management, subscription overview, usage statistics, revenue analytics

The admin dashboard is protected by role-based access control. Only users with the `admin` role can access it.

## Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: The service role key bypasses Row Level Security. Keep it secret and never commit it to version control.

## Troubleshooting

### "Missing required environment variables"
- Make sure you have a `.env` file in the project root
- Verify the variable names match exactly
- Restart your terminal/IDE after creating/updating `.env`

### "Error creating auth user"
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check that your Supabase project is active
- Ensure you're using the service role key, not the anon key

### "User already exists"
- This is normal if you've run the script before
- The script will skip existing users and continue

### Admin dashboard shows "Access Denied"
- Make sure the user has the `admin` role assigned
- Check that you're signed in with an admin account
- The role check uses the database `has_role` function

## Manual Setup (Alternative)

If the script doesn't work, you can manually create users:

1. **Create users in Supabase Auth Dashboard**:
   - Go to Authentication > Users
   - Create new user with email and password

2. **Create profile** (run SQL in Supabase SQL Editor):
   ```sql
   INSERT INTO public.profiles (id, email, full_name, subscription_plan)
   VALUES ('user-uuid-here', 'email@example.com', 'User Name', 'free');
   ```

3. **Create subscription** (for premium users):
   ```sql
   INSERT INTO public.subscriptions (user_id, plan_type, status, current_period_start, current_period_end)
   VALUES ('user-uuid-here', 'premium', 'active', NOW(), NOW() + INTERVAL '1 month');
   ```

4. **Assign admin role**:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('user-uuid-here', 'admin');
   ```

## Security Notes

- Test users use simple passwords for convenience
- **Never use these passwords in production**
- The service role key should only be used in secure environments
- Consider rotating test user passwords regularly


