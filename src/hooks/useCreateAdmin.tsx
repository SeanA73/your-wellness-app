import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateAdminParams {
  email: string;
  password: string;
  fullName?: string;
}

export const useCreateAdmin = () => {
  const [loading, setLoading] = useState(false);

  const createAdmin = async ({ email, password, fullName }: CreateAdminParams) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { email, password, fullName }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return { success: false };
      }

      toast.success(`Admin account created: ${email}`);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin account');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { createAdmin, loading };
};