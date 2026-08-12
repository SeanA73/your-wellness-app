import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Calendar, Crown, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { UpgradePrompt } from './UpgradePrompt';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const SubscriptionSettings = () => {
  const { subscription, getCurrentPlan, hasPremiumAccess, cancelSubscription, createCheckoutSession } = useSubscription();
  const { toast } = useToast();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentPlan = getCurrentPlan();
  const isPremium = hasPremiumAccess();

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await createCheckoutSession('premium', false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      await cancelSubscription();
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will remain active until the end of the current billing period.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Subscription Plan
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your FitMatePro subscription
              </CardDescription>
            </div>
            <Badge variant={isPremium ? 'default' : 'outline'} className="text-lg px-3 py-1">
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPremium ? (
            <>
              {subscription && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Active Subscription</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.plan_type === 'premium' ? 'Premium Plan' : 'Free Plan'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {subscription.current_period_end && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Next Billing Date</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(subscription.current_period_end)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <X className="w-4 h-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Your subscription will remain active until the end of your current billing period. 
                          After that, you'll be moved to the free plan. You can resubscribe anytime.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancel}
                          disabled={isCanceling}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Premium to unlock unlimited workout tracking, custom workout plans, and health data export.
                </p>
                <Button onClick={handleUpgrade} disabled={isUpgrading} className="w-full" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
                </Button>
              </div>
              <UpgradePrompt trigger="premium_feature_access" featureName="subscription" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To manage your payment methods and view billing history, please visit your Stripe customer portal.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  // This would open Stripe customer portal
                  toast({
                    title: "Coming Soon",
                    description: "Payment method management will be available soon.",
                  });
                }}
              >
                Manage Payment Methods
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Billing information is available for Premium subscribers.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};





