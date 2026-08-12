import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Crown } from 'lucide-react';

interface PremiumRouteProps {
  children: ReactNode;
  showUpgrade?: boolean;
}

export const PremiumRoute = ({ children, showUpgrade = true }: PremiumRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasPremiumAccess, loading: subLoading } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasPremiumAccess()) {
    if (showUpgrade) {
      return (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Premium Feature</CardTitle>
                <CardDescription className="text-base mt-2">
                  This feature is available with FitMatePro Premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpgradePrompt
                  trigger="premium_feature_access"
                  featureName="premium_feature"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
};





