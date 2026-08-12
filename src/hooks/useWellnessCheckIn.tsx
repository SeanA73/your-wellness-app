import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface WellnessCheckIn {
  id: string;
  user_id: string;
  mood_rating: number;
  energy_level: number;
  stress_level: number;
  sleep_quality: number;
  notes?: string;
  activities?: string[];
  checked_in_at: string;
  created_at: string;
}

// wellness_checkins.activities is jsonb, so the generated type is Json — it can be
// an object, a string, or null, none of which are string[]. Normalise at the read
// boundary rather than casting, so a malformed row can't crash the consumer.
type WellnessCheckInRow = Omit<WellnessCheckIn, 'activities'> & { activities: unknown };

const normalizeCheckIn = (row: WellnessCheckInRow): WellnessCheckIn => ({
  ...row,
  activities: Array.isArray(row.activities) ? (row.activities as string[]) : [],
});

export const useWellnessCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkIns, setCheckIns] = useState<WellnessCheckIn[]>([]);
  const [todayCheckIn, setTodayCheckIn] = useState<WellnessCheckIn | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCheckIns();
      fetchTodayCheckIn();
    }
  }, [user]);

  const fetchCheckIns = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wellness_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('checked_in_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setCheckIns((data || []).map(normalizeCheckIn));
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayCheckIn = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('wellness_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checked_in_at', `${today}T00:00:00`)
        .lt('checked_in_at', `${today}T23:59:59`)
        .maybeSingle();

      if (error) throw error;
      setTodayCheckIn(data ? normalizeCheckIn(data) : null);
    } catch (error) {
      console.error('Error fetching today check-in:', error);
    }
  };

  const submitCheckIn = async (checkInData: {
    mood_rating: number;
    energy_level: number;
    stress_level: number;
    sleep_quality: number;
    notes?: string;
    activities?: string[];
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to submit a check-in",
        variant: "destructive",
      });
      return { data: null, error: 'Not authenticated' };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wellness_checkins')
        .insert([{
          user_id: user.id,
          checked_in_at: new Date().toISOString(),
          ...checkInData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Check-in saved!",
        description: "Your wellness data has been recorded.",
      });

      await fetchTodayCheckIn();
      await fetchCheckIns();

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save check-in';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getStreak = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error } = await supabase
        .from('wellness_checkins')
        .select('checked_in_at')
        .eq('user_id', user.id)
        .order('checked_in_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < data.length; i++) {
        const checkInDate = new Date(data[i].checked_in_at);
        checkInDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  return {
    checkIns,
    todayCheckIn,
    loading,
    submitCheckIn,
    getStreak,
    refetch: fetchCheckIns,
  };
};





