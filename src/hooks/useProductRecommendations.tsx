import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category: string;
  subcategory: string;
  price_cents: number;
  original_price_cents: number | null;
  currency: string;
  affiliate_url: string;
  image_url: string | null;
  brand: string | null;
  rating: number | null;
  review_count: number;
  tags: string[];
  features: any;
  is_featured: boolean;
}

interface RecommendationsResult {
  products: Product[];
  reasoning: string;
}

export const useProductRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke<RecommendationsResult>(
        'recommend-products',
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );

      if (functionError) {
        console.error('Error fetching recommendations:', functionError);
        setError('Failed to load recommendations');
        return;
      }

      if (data) {
        setRecommendations(data.products || []);
        setReasoning(data.reasoning || '');
      }
    } catch (err) {
      console.error('Exception in fetchRecommendations:', err);
      setError('An error occurred while loading recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  return {
    recommendations,
    reasoning,
    loading,
    error,
    refetch: fetchRecommendations,
  };
};
