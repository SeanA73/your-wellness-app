import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Play, ExternalLink } from 'lucide-react';

interface AdData {
  id: string;
  type: 'banner' | 'native' | 'reward_video' | 'sponsored_content';
  placement: string;
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl?: string;
  reward?: string;
  provider: string;
}

interface AdManagerProps {
  placement: string;
  context?: Record<string, any>;
  className?: string;
  onAdInteraction?: (interactionType: string) => void;
}

const AD_CONTENT: Record<string, AdData[]> = {
  'workout_rest': [
    {
      id: 'fitness-gear-1',
      type: 'banner',
      placement: 'workout_rest',
      title: 'Premium Resistance Bands',
      description: 'Complete your home gym setup with professional-grade resistance bands.',
      imageUrl: '/api/placeholder/300/100',
      ctaText: 'Shop Now',
      ctaUrl: '#',
      provider: 'fitness-store'
    }
  ],
  'nutrition_tip': [
    {
      id: 'meal-kit-1',
      type: 'native',
      placement: 'nutrition_tip',
      title: 'Fresh Meal Kits Delivered',
      description: 'Get healthy, pre-portioned ingredients delivered to your door.',
      imageUrl: '/api/placeholder/250/150',
      ctaText: 'Try Free',
      ctaUrl: '#',
      provider: 'meal-delivery'
    }
  ],
  'recipe_suggestion': [
    {
      id: 'superfood-1',
      type: 'sponsored_content',
      placement: 'recipe_suggestion',
      title: 'Organic Superfood Blend',
      description: 'Boost your smoothies with our premium superfood powder.',
      imageUrl: '/api/placeholder/200/200',
      ctaText: 'Learn More',
      ctaUrl: '#',
      provider: 'nutrition-brand'
    }
  ],
  'upgrade_prompt': [
    {
      id: 'reward-video-1',
      type: 'reward_video',
      placement: 'upgrade_prompt',
      title: 'Watch & Unlock Premium Features',
      description: 'Get 24-hour access to unlimited workouts by watching this short video.',
      ctaText: 'Watch Video',
      reward: '24h Premium Access',
      provider: 'fitmate'
    }
  ]
};

export const AdManager = ({ placement, context, className, onAdInteraction }: AdManagerProps) => {
  const { user } = useAuth();
  const { hasPremiumAccess } = useSubscription();
  const [adData, setAdData] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    // Don't show ads to premium users
    if (hasPremiumAccess()) return;

    // Get ad content for this placement
    const adsForPlacement = AD_CONTENT[placement];
    if (adsForPlacement && adsForPlacement.length > 0) {
      const randomAd = adsForPlacement[Math.floor(Math.random() * adsForPlacement.length)];
      setAdData(randomAd);
      setIsVisible(true);
      
      // Track ad view
      trackAdInteraction(randomAd, 'view');
    }
  }, [placement, hasPremiumAccess]);

  const trackAdInteraction = async (ad: AdData, interactionType: string) => {
    if (!user) return;

    try {
      await supabase.from('ad_interactions').insert([{
        user_id: user.id,
        ad_type: ad.type,
        ad_placement: ad.placement,
        interaction_type: interactionType,
        ad_provider: ad.provider,
        session_id: sessionId
      }]);
    } catch (error) {
      // Silent fail for ad tracking
    }

    onAdInteraction?.(interactionType);
  };

  const handleAdClick = () => {
    if (!adData) return;
    
    trackAdInteraction(adData, 'click');
    
    if (adData.ctaUrl) {
      window.open(adData.ctaUrl, '_blank');
    }
  };

  const handleDismiss = () => {
    if (!adData) return;
    
    trackAdInteraction(adData, 'dismiss');
    setIsVisible(false);
  };

  const handleRewardVideo = async () => {
    if (!adData) return;
    
    trackAdInteraction(adData, 'complete');
    
    // Grant temporary premium access
    if (user && adData.reward) {
      try {
        await supabase.functions.invoke('grant-temporary-access', {
          body: { 
            userId: user.id, 
            duration: '24h',
            features: ['unlimited_workouts']
          }
        });
      } catch (error) {
        // Silent fail for temporary access
      }
    }
    
    setIsVisible(false);
  };

  if (!isVisible || !adData) return null;

  return (
    <div className={`ad-container ${className}`}>
      <div className="ad-label text-xs text-muted-foreground mb-2">Sponsored</div>
      
      {adData.type === 'banner' && (
        <BannerAd 
          data={adData} 
          onAdClick={handleAdClick}
          onDismiss={handleDismiss}
        />
      )}
      
      {adData.type === 'native' && (
        <NativeAd 
          data={adData} 
          onAdClick={handleAdClick}
          onDismiss={handleDismiss}
        />
      )}
      
      {adData.type === 'sponsored_content' && (
        <SponsoredContent 
          data={adData} 
          onAdClick={handleAdClick}
          onDismiss={handleDismiss}
        />
      )}
      
      {adData.type === 'reward_video' && (
        <RewardVideoAd 
          data={adData} 
          onWatch={handleRewardVideo}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};

const BannerAd = ({ data, onAdClick, onDismiss }: { 
  data: AdData; 
  onAdClick: () => void; 
  onDismiss: () => void;
}) => (
  <Card className="relative p-4 bg-gradient-to-r from-secondary/20 to-accent/20 border-dashed">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-6 w-6"
      onClick={onDismiss}
    >
      <X className="h-4 w-4" />
    </Button>
    
    <div className="flex items-center gap-3">
      {data.imageUrl && (
        <img 
          src={data.imageUrl} 
          alt={data.title}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h4 className="font-medium text-sm">{data.title}</h4>
        <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
        <Button size="sm" onClick={onAdClick} className="h-7 text-xs">
          {data.ctaText}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  </Card>
);

const NativeAd = ({ data, onAdClick, onDismiss }: { 
  data: AdData; 
  onAdClick: () => void; 
  onDismiss: () => void;
}) => (
  <Card className="relative p-4 border-dashed">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-6 w-6"
      onClick={onDismiss}
    >
      <X className="h-4 w-4" />
    </Button>
    
    <div className="space-y-3">
      {data.imageUrl && (
        <img 
          src={data.imageUrl} 
          alt={data.title}
          className="w-full h-32 object-cover rounded"
        />
      )}
      <div>
        <h4 className="font-medium">{data.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{data.description}</p>
        <Button onClick={onAdClick} className="w-full">
          {data.ctaText}
        </Button>
      </div>
    </div>
  </Card>
);

const SponsoredContent = ({ data, onAdClick, onDismiss }: { 
  data: AdData; 
  onAdClick: () => void; 
  onDismiss: () => void;
}) => (
  <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 border border-dashed border-primary/20">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-6 w-6"
      onClick={onDismiss}
    >
      <X className="h-4 w-4" />
    </Button>
    
    <div className="flex gap-3">
      {data.imageUrl && (
        <img 
          src={data.imageUrl} 
          alt={data.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h4 className="font-semibold text-primary">{data.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
        <Button variant="outline" size="sm" onClick={onAdClick}>
          {data.ctaText}
        </Button>
      </div>
    </div>
  </div>
);

const RewardVideoAd = ({ data, onWatch, onDismiss }: { 
  data: AdData; 
  onWatch: () => void; 
  onDismiss: () => void;
}) => (
  <Card className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-6 w-6"
      onClick={onDismiss}
    >
      <X className="h-4 w-4" />
    </Button>
    
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
        <Play className="h-8 w-8 text-primary" />
      </div>
      
      <div>
        <h4 className="font-semibold">{data.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
        {data.reward && (
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium">
            🎁 Reward: {data.reward}
          </div>
        )}
      </div>
      
      <Button onClick={onWatch} className="w-full">
        <Play className="mr-2 h-4 w-4" />
        {data.ctaText}
      </Button>
    </div>
  </Card>
);