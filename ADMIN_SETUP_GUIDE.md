# Admin Setup Guide

## Creating Your First Admin User

There are two ways to create an admin user in FitMatePro:

### Option 1: Using the Admin Setup Page (Recommended)

1. Navigate to `/admin-setup` in your browser
2. Fill in the admin user details:
   - Full Name
   - Email address
   - Password (min 8 characters)
3. Click "Create Admin User"
4. Sign in at `/auth` with your new admin credentials
5. Access the admin dashboard at `/admin`

### Option 2: Using the Seed Script

1. Ensure your `.env` file has these variables:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the seed script:
   ```bash
   npm run seed:users
   ```

3. This creates three test users:
   - **Free User**: `free.user@test.com` / `TestUser123!`
   - **Premium User**: `premium.user@test.com` / `TestUser123!`
   - **Admin User**: `admin@fitmatepro.com` / `Admin123!`

4. Sign in with the admin credentials at `/auth`

## Admin Features Protected

All admin features are protected using Row-Level Security (RLS) and the `has_role()` database function:

### Protected Routes & Components:
- `/admin` - Admin Dashboard (checks `isAdmin` from `useAdmin` hook)
- User Management (view/edit all users)
- Subscription Management (update user subscriptions)
- Role Assignment (assign/remove admin roles)
- Revenue & Analytics (view all revenue data)
- Temporary Access Grants

### Security Implementation:
1. **Database Level**: RLS policies use `has_role(auth.uid(), 'admin')` function
2. **Application Level**: `useAdmin` hook checks admin status via RLS query
3. **No Client-Side Storage**: Admin status never stored in localStorage/sessionStorage

### Protected Tables:
- `profiles` - Admins can view/update all profiles
- `subscriptions` - Admins can view/update all subscriptions
- `user_roles` - Admins can manage all roles
- `temporary_access` - Admins can grant temporary access

## Verifying Admin Access

To verify an admin user has been created correctly:

1. Run the verify script:
   ```bash
   npm run verify:users
   ```

2. Or check manually by:
   - Signing in with admin credentials
   - Navigating to `/admin`
   - You should see the full admin dashboard with all tabs

3. Non-admin users will see "Access Denied" message

## Security Best Practices

✅ **DO:**
- Use the `has_role()` function for all admin checks
- Verify admin status on both client and server
- Create admin users through secure methods (setup page or seed script)
- Use strong passwords for admin accounts

❌ **DON'T:**
- Store admin status in localStorage or sessionStorage
- Hardcode admin credentials in the application
- Skip RLS policies for convenience
- Share admin credentials

## Troubleshooting

**"Access Denied" on Admin Dashboard:**
- Verify user has admin role: Check `user_roles` table
- Ensure RLS policies are active on all tables
- Check that `has_role()` function exists in database

**Admin Setup Page Not Working:**
- Verify email confirmation is disabled (for testing)
- Check console for error messages
- Ensure database has correct schema and RLS policies

**Seed Script Fails:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Ensure service role key (not anon key) is used
- Check that database migrations have been applied
