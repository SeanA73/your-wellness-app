/**
 * Quick script to verify test users exist in Supabase Auth
 * 
 * Usage: npx tsx scripts/verify-users.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testEmails = [
  'free.user@test.com',
  'premium.user@test.com',
  'admin@fitmatepro.com',
  'admin@test.com'
];

async function verifyUsers() {
  console.log('🔍 Checking for test users...\n');

  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('❌ Error fetching users:', error.message);
    return;
  }

  console.log(`Found ${users.users.length} total users in Supabase Auth\n`);

  for (const email of testEmails) {
    const user = users.users.find(u => u.email === email);
    if (user) {
      console.log(`✅ ${email} - EXISTS (ID: ${user.id})`);
      console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.created_at}\n`);
    } else {
      console.log(`❌ ${email} - NOT FOUND`);
      console.log(`   Run: npm run seed:users to create this user\n`);
    }
  }

  console.log('\n💡 If users are missing, run: npm run seed:users');
}

verifyUsers().catch(console.error);



