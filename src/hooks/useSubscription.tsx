import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'premium' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
}

export interface UsageLimit {
  feature_name: string;
  limit_value: number | null;
  limit_period: string;
  current_usage: number;
  can_use: boolean;
}

export const useSubscription = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usageLimits, setUsageLimits] = useState<UsageLimit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's subscription
  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data as Subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  // Get current plan
  const getCurrentPlan = (): 'free' | 'premium' | 'pro' => {
    return subscription?.plan_type || 'free';
  };

  // Check if user can use a feature
  const canUseFeature = async (featureName: string, period: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('check_usage_limit', {
        user_uuid: user.id,
        feature: featureName,
        period: period
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return false;
    }
  };

  // Increment usage for a feature
  const incrementUsage = async (featureName: string, period: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('increment_usage', {
        user_uuid: user.id,
        feature: featureName,
        period: period
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  // Get usage limits for current plan
  const fetchUsageLimits = async () => {
    if (!user) return;

    const currentPlan = getCurrentPlan();
    
    try {
      const { data: limits, error } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('plan_type', currentPlan);

      if (error) throw error;

      // Get current usage for each feature
      const limitsWithUsage = await Promise.all(
        (limits || []).map(async (limit) => {
          const currentUsage = await getCurrentUsage(limit.feature_name, limit.limit_period);
          const canUse = limit.limit_value === null || currentUsage < limit.limit_value;
          
          return {
            feature_name: limit.feature_name,
            limit_value: limit.limit_value,
            limit_period: limit.limit_period,
            current_usage: currentUsage,
            can_use: canUse
          };
        })
      );

      setUsageLimits(limitsWithUsage);
    } catch (error) {
      console.error('Error fetching usage limits:', error);
    }
  };

  // Get current usage for a feature
  const getCurrentUsage = async (featureName: string, period: string): Promise<number> => {
    if (!user) return 0;

    try {
      let periodStart: Date;
      const now = new Date();
      
      switch (period) {
        case 'daily':
          periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          const dayOfWeek = now.getDay();
          periodStart = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
          periodStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), periodStart.getDate());
          break;
        case 'monthly':
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_type', featureName)
        .gte('period_start', periodStart.toISOString());

      if (error) throw error;

      return data?.reduce((sum, record) => sum + (record.usage_count || 0), 0) || 0;
    } catch (error) {
      console.error('Error getting current usage:', error);
      return 0;
    }
  };

  // Create Stripe checkout session
  const createCheckoutSession = async (planType: 'premium' | 'pro', isAnnual: boolean = false) => {
    try {
      const priceMap = {
        'premium-monthly': 'price_premium_monthly',
        'premium-annual': 'price_premium_annual',
        'pro-monthly': 'price_pro_monthly',
        'pro-annual': 'price_pro_annual'
      };

      const priceKey = `${planType}-${isAnnual ? 'annual' : 'monthly'}` as keyof typeof priceMap;
      const priceId = priceMap[priceKey];

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, userId: user?.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: subscription.stripe_subscription_id }
      });

      if (error) throw error;

      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled and will end at the current period.",
      });

      await fetchSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check if user has access to premium features
  const hasPremiumAccess = (): boolean => {
    const plan = getCurrentPlan();
    return plan === 'premium' || plan === 'pro';
  };

  // Check if user has access to pro features
  const hasProAccess = (): boolean => {
    const plan = getCurrentPlan();
    return plan === 'pro';
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUsageLimits();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  return {
    subscription,
    usageLimits,
    loading,
    getCurrentPlan,
    canUseFeature,
    incrementUsage,
    createCheckoutSession,
    cancelSubscription,
    hasPremiumAccess,
    hasProAccess,
    fetchSubscription,
    fetchUsageLimits
  };
};