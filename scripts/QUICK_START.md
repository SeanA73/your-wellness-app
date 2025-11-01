# Quick Start: Creating Test Users

## Setup (One-Time)

1. **Get your Supabase Service Role Key**:
   - Go to [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API
   - Copy the `service_role` key (secret) - NOT the anon key

2. **Create `.env` file** in project root:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Install dependencies** (if not already):
   ```bash
   npm install
   ```

## Create Test Users

Run the seed script:
```bash
npm run seed:users
```

## Test Accounts Created

After running the script, you can sign in with:

| User Type | Email | Password | Access |
|-----------|-------|----------|--------|
| **Free** | `free.user@test.com` | `TestUser123!` | Free plan features |
| **Premium** | `premium.user@test.com` | `TestUser123!` | All premium features |
| **Admin** | `admin@fitmatepro.com` | `Admin123!` | Premium + Admin Dashboard |

## Admin Dashboard

- **URL**: Navigate to `/admin` or click "Admin Dashboard" in user menu (only visible for admins)
- **Access**: Only users with `admin` role can access
- **Features**: User management, subscription overview, usage stats, revenue analytics

## Troubleshooting

**Error: "Missing environment variables"**
- Make sure `.env` file exists in project root
- Verify variable names are exactly: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Don't use `VITE_` prefix for the service role key

**Error: "Failed to create user"**
- Verify your service role key is correct
- Check Supabase project is active
- Ensure you're using service_role key, not anon key

**Can't access admin dashboard**
- Make sure you signed in with an admin account
- Check that the `has_role` function exists in your database
- Verify the user has `admin` role in `user_roles` table


