import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestUser {
  email: string;
  password: string;
  fullName: string;
  planType: 'free' | 'premium';
  role: 'admin' | 'user';
}

const testUsers: TestUser[] = [
  {
    email: 'free.user@test.com',
    password: 'TestUser123!',
    fullName: 'Free Test User',
    planType: 'free',
    role: 'user',
  },
  {
    email: 'premium.user@test.com',
    password: 'TestUser123!',
    fullName: 'Premium Test User',
    planType: 'premium',
    role: 'user',
  },
  {
    email: 'admin@fitmatepro.com',
    password: 'Admin123!',
    fullName: 'Admin User',
    planType: 'premium',
    role: 'admin',
  },
  {
    email: 'admin@test.com',
    password: 'Admin123!',
    fullName: 'Admin User (Legacy)',
    planType: 'premium',
    role: 'admin',
  },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase Admin Client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: hasAdminRole } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    if (!hasAdminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating test users...');
    const results: any[] = [];

    for (const testUser of testUsers) {
      console.log(`\nProcessing ${testUser.email}...`);

      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find((u) => u.email === testUser.email);

        let userId: string;

        if (existingUser) {
          console.log(`User ${testUser.email} already exists, skipping creation`);
          userId = existingUser.id;
          results.push({
            email: testUser.email,
            status: 'already_exists',
            userId,
          });
          continue;
        }

        // Create auth user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
          user_metadata: {
            full_name: testUser.fullName,
          },
        });

        if (createError) {
          console.error(`Error creating user ${testUser.email}:`, createError);
          results.push({
            email: testUser.email,
            status: 'error',
            error: createError.message,
          });
          continue;
        }

        userId = newUser.user.id;
        console.log(`Created auth user: ${userId}`);

        // Create profile
        const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
          id: userId,
          email: testUser.email,
          full_name: testUser.fullName,
          subscription_plan: testUser.planType,
          activity_level: 'moderate',
          fitness_goals: ['general_fitness'],
        });

        if (profileError) {
          console.error(`Error creating profile for ${testUser.email}:`, profileError);
        }

        // Create subscription for premium users
        if (testUser.planType === 'premium') {
          const currentDate = new Date();
          const oneYearLater = new Date(currentDate);
          oneYearLater.setFullYear(currentDate.getFullYear() + 1);

          const { error: subError } = await supabaseAdmin.from('subscriptions').insert({
            user_id: userId,
            plan_type: 'premium',
            status: 'active',
            current_period_start: currentDate.toISOString(),
            current_period_end: oneYearLater.toISOString(),
          });

          if (subError) {
            console.error(`Error creating subscription for ${testUser.email}:`, subError);
          }
        }

        // Create user preferences
        const { error: prefError } = await supabaseAdmin.from('user_preferences').upsert({
          user_id: userId,
          workout_reminders: true,
          meal_reminders: true,
          metric_units: true,
        });

        if (prefError) {
          console.error(`Error creating preferences for ${testUser.email}:`, prefError);
        }

        // Assign role
        const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
          user_id: userId,
          role: testUser.role,
        });

        if (roleError) {
          console.error(`Error assigning role for ${testUser.email}:`, roleError);
        }

        console.log(`Successfully created ${testUser.email} with ${testUser.role} role`);
        results.push({
          email: testUser.email,
          status: 'created',
          userId,
          role: testUser.role,
          plan: testUser.planType,
        });
      } catch (error) {
        console.error(`Unexpected error for ${testUser.email}:`, error);
        results.push({
          email: testUser.email,
          status: 'error',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test users processing complete',
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in create-test-users function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
