# Create Test Users - Step by Step

## The Problem
If you're getting "Invalid login credentials", it means the users don't exist in Supabase Auth yet. The seed script needs to run to create them.

## Solution: Run the Seed Script

### Step 1: Set Up Environment Variables

Create a `.env` file in the project root (same folder as `package.json`):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**How to get these:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (the secret one) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: Use the `service_role` key (secret), NOT the `anon` key!

### Step 2: Run the Script

```bash
npm run seed:users
```

### Step 3: Verify Users Were Created

```bash
npm run verify:users
```

This will show which test users exist.

### Step 4: Sign In

Now you can sign in with:
- **Free**: `free.user@test.com` / `TestUser123!`
- **Premium**: `premium.user@test.com` / `TestUser123!`
- **Admin**: `admin@fitmatepro.com` / `Admin123!`

## Alternative: Create One User Manually (Quick Test)

If the script isn't working, you can create one user manually in Supabase Dashboard:

1. Go to **Authentication** → **Users** → **Add User**
2. Enter email: `test@example.com`
3. Enter password: `Test123!`
4. **Auto Confirm User**: ✅ (check this box!)
5. Click **Create User**

Then create the profile (SQL Editor):
```sql
INSERT INTO public.profiles (id, email, full_name, subscription_plan)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'test@example.com',
  'Test User',
  'free'
);
```

Then sign in with `test@example.com` / `Test123!`

## Troubleshooting

**"Missing environment variables"**
- Make sure `.env` file is in project root
- Restart terminal after creating `.env`
- Check variable names are exact: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**"Invalid login credentials" after running script**
- Run `npm run verify:users` to check if users exist
- Make sure email is confirmed (script sets `email_confirm: true`)
- Check Supabase Dashboard → Authentication → Users to verify

**Script errors**
- Verify service role key is correct
- Check Supabase project is active
- Make sure you're using service_role key, not anon key


