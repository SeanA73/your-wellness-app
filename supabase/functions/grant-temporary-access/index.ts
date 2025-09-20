import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, duration, features } = await req.json()

    if (!userId || !duration || !features) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse duration (e.g., "24h", "1d", "3d")
    const durationMs = parseDuration(duration)
    const expiresAt = new Date(Date.now() + durationMs)

    // Store temporary access grant
    const { error } = await supabaseClient
      .from('temporary_access')
      .insert([{
        user_id: userId,
        features: features,
        granted_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        granted_via: 'reward_ad'
      }])

    if (error) {
      console.error('Error granting temporary access:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to grant access' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Track revenue event for ad completion
    await supabaseClient
      .from('revenue_events')
      .insert([{
        user_id: userId,
        event_type: 'ad_revenue',
        amount_cents: 50, // Estimated revenue from reward video ad
        currency: 'USD',
        platform: 'adsense',
        metadata: {
          ad_type: 'reward_video',
          reward_granted: features.join(', '),
          duration: duration
        }
      }])

    console.log(`Granted temporary access to user ${userId} for ${duration}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Granted ${features.join(', ')} access for ${duration}`,
        expires_at: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error granting temporary access:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([hdwm])$/)
  if (!match) {
    throw new Error('Invalid duration format. Use format like "24h", "1d", "1w", "1m"')
  }

  const value = parseInt(match[1])
  const unit = match[2]

  const multipliers = {
    'h': 60 * 60 * 1000,      // hours
    'd': 24 * 60 * 60 * 1000, // days
    'w': 7 * 24 * 60 * 60 * 1000, // weeks
    'm': 30 * 24 * 60 * 60 * 1000  // months (approximate)
  }

  return value * multipliers[unit as keyof typeof multipliers]
}