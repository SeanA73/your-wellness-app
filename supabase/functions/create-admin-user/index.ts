import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateAdminRequest {
  email: string;
  password: string;
  fullName?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password, fullName } = await req.json() as CreateAdminRequest;

    console.log(`Creating admin user: ${email}`);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email);

    if (existingUser) {
      console.log(`User ${email} already exists`);
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || 'Admin User',
      }
    });

    if (authError || !authUser.user) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    console.log(`Auth user created: ${authUser.user.id}`);

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        email,
        full_name: fullName || 'Admin User',
        subscription_plan: 'premium',
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    console.log(`Profile created for user: ${authUser.user.id}`);

    // Create premium subscription
    const now = new Date();
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: authUser.user.id,
        plan_type: 'premium',
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: oneYearFromNow.toISOString(),
      });

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw subscriptionError;
    }

    console.log(`Subscription created for user: ${authUser.user.id}`);

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role: 'admin',
      });

    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      throw roleError;
    }

    console.log(`Admin role assigned to user: ${authUser.user.id}`);

    // Create user preferences
    const { error: preferencesError } = await supabaseAdmin
      .from('user_preferences')
      .insert({
        user_id: authUser.user.id,
      });

    if (preferencesError) {
      console.error('Error creating preferences:', preferencesError);
      throw preferencesError;
    }

    console.log(`Preferences created for user: ${authUser.user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in create-admin-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});