import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import FitMateHeader from '@/components/FitMateHeader';
// Auth gating lives on the route in src/App.tsx, not in here.

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchSubscription, hasPremiumAccess } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && user) {
      // Refresh subscription data
      fetchSubscription().finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubscription();
    setRefreshing(false);
  };

  // Only the subscription row proves the purchase landed. Arriving on this URL
  // does not, and neither does a session_id — the Stripe webhook writes the
  // entitlement, and it may not have fired yet.
  const isPremium = hasPremiumAccess();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Landed here without a checkout session at all.
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background">
        <FitMateHeader />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">No checkout session found</CardTitle>
              <CardDescription className="text-base mt-2">
                This page confirms a completed checkout. There's no checkout to confirm here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/')} className="flex-1" size="lg">
                  Go to Dashboard
                </Button>
                <Button onClick={() => navigate('/premium')} variant="outline" className="flex-1" size="lg">
                  View Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Checkout happened, but the entitlement hasn't appeared yet.
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <FitMateHeader />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Finishing up your subscription</CardTitle>
              <CardDescription className="text-base mt-2">
                Your payment went through, but your account hasn't been upgraded yet.
                This usually takes a few moments. If it doesn't update shortly, contact
                support with your checkout reference.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-center text-muted-foreground break-all">
                Reference: {sessionId}
              </p>
              <div className="flex gap-3">
                <Button onClick={handleRefresh} disabled={refreshing} className="flex-1" size="lg">
                  {refreshing ? 'Checking...' : 'Check again'}
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="flex-1" size="lg">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FitMateHeader />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">Welcome to Premium! 🎉</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your subscription is now active. Enjoy unlimited access to all FitMatePro features!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Unlimited workout and nutrition logging</li>
                <li>✓ Custom workout builder</li>
                <li>✓ Advanced meal planning</li>
                <li>✓ Health data export</li>
                <li>✓ Premium themes</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/')} className="flex-1" size="lg">
                Go to Dashboard
              </Button>
              <Button onClick={() => navigate('/premium')} variant="outline" className="flex-1" size="lg">
                Explore Premium Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccess;





