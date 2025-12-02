import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Crown, 
  TrendingUp, 
  Activity, 
  DollarSign,
  AlertCircle,
  Calendar,
  Target,
  Utensils,
  ExternalLink,
  MousePointerClick,
  ShoppingBag,
  UserCog,
  Shield,
  Clock,
  Gift
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface DashboardStats {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalCheckins: number;
  totalMeals: number;
  totalGoals: number;
  usageStats: {
    feature: string;
    count: number;
  }[];
  affiliateStats: {
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
    affiliateRevenue: number;
    topProducts: {
      product_name: string;
      clicks: number;
      conversions: number;
    }[];
  };
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  subscription_plan: string;
  created_at: string;
  last_checkin?: string;
}

interface UserManagementData extends UserData {
  roles: string[];
  subscription_status?: string;
  subscription_end?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [managementUsers, setManagementUsers] = useState<UserManagementData[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [tempAccessDays, setTempAccessDays] = useState<number>(7);
  const [tempAccessFeature, setTempAccessFeature] = useState<string>('ai_coaching');

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      fetchDashboardData();
      fetchManagementUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, adminLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user counts by subscription
      const { data: userCounts } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .then(result => {
          const counts = { free: 0, premium: 0 };
          result.data?.forEach(profile => {
            // Handle legacy 'pro' plans as 'premium'
            const plan = profile.subscription_plan === 'pro' ? 'premium' : profile.subscription_plan;
            if (plan === 'free' || plan === 'premium') {
              counts[plan as keyof typeof counts] = 
                (counts[plan as keyof typeof counts] || 0) + 1;
            }
          });
          return { data: counts };
        });

      // Fetch revenue data
      const { data: revenueData } = await supabase
        .from('revenue_events')
        .select('amount_cents')
        .then(result => ({
          data: result.data?.reduce((sum, event) => sum + event.amount_cents, 0) || 0
        }));

      // Fetch active subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('status', 'active');

      // Fetch wellness checkins count
      const { data: checkins } = await supabase
        .from('wellness_checkins')
        .select('id');

      // Fetch meals count
      const { data: meals } = await supabase
        .from('meals')
        .select('id');

      // Fetch goals count
      const { data: goals } = await supabase
        .from('user_goals')
        .select('id');

      // Fetch usage statistics
      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('feature_type, usage_count')
        .then(result => {
          const usageMap = new Map();
          result.data?.forEach(usage => {
            const current = usageMap.get(usage.feature_type) || 0;
            usageMap.set(usage.feature_type, current + usage.usage_count);
          });
          return {
            data: Array.from(usageMap.entries()).map(([feature, count]) => ({
              feature,
              count
            }))
          };
        });

      // Fetch affiliate clicks data
      const { data: affiliateClicks } = await supabase
        .from('affiliate_clicks')
        .select('*');

      // Fetch affiliate products for product names
      const { data: affiliateProducts } = await supabase
        .from('affiliate_products')
        .select('id, name');

      // Calculate affiliate stats
      const totalClicks = affiliateClicks?.length || 0;
      const totalConversions = affiliateClicks?.filter(c => c.converted).length || 0;
      const affiliateRevenue = affiliateClicks?.reduce((sum, click) => 
        sum + (click.conversion_amount_cents || 0), 0) || 0;

      // Calculate top products
      const productClickMap = new Map();
      affiliateClicks?.forEach(click => {
        if (!click.product_id) return;
        const current = productClickMap.get(click.product_id) || { clicks: 0, conversions: 0 };
        current.clicks += 1;
        if (click.converted) current.conversions += 1;
        productClickMap.set(click.product_id, current);
      });

      const topProducts = Array.from(productClickMap.entries())
        .map(([productId, stats]) => {
          const product = affiliateProducts?.find(p => p.id === productId);
          return {
            product_name: product?.name || 'Unknown Product',
            clicks: stats.clicks,
            conversions: stats.conversions
          };
        })
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          subscription_plan,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalUsers: (userCounts?.free || 0) + (userCounts?.premium || 0),
        freeUsers: userCounts?.free || 0,
        premiumUsers: userCounts?.premium || 0,
        totalRevenue: revenueData || 0,
        activeSubscriptions: subscriptions?.length || 0,
        totalCheckins: checkins?.length || 0,
        totalMeals: meals?.length || 0,
        totalGoals: goals?.length || 0,
        usageStats: usageData || [],
        affiliateStats: {
          totalClicks,
          totalConversions,
          conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
          affiliateRevenue,
          topProducts
        }
      });

      setUsers(recentUsers || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchManagementUsers = async () => {
    try {
      // Fetch all users with their profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profiles) return;

      // Fetch roles for all users
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Fetch subscriptions for all users
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('user_id, status, current_period_end')
        .eq('status', 'active');

      // Combine data
      const usersWithDetails: UserManagementData[] = profiles.map(profile => {
        const roles = userRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || [];
        const subscription = subscriptions?.find(s => s.user_id === profile.id);

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || 'Unknown',
          subscription_plan: profile.subscription_plan || 'free',
          created_at: profile.created_at,
          roles,
          subscription_status: subscription?.status,
          subscription_end: subscription?.current_period_end
        };
      });

      setManagementUsers(usersWithDetails);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user management data.",
        variant: "destructive"
      });
    }
  };

  const handleAssignRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role "${role}" assigned successfully.`
      });

      fetchManagementUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role "${role}" removed successfully.`
      });

      fetchManagementUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove role.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSubscription = async (userId: string, status: string) => {
    try {
      const now = new Date();
      const periodEnd = new Date(now.setMonth(now.getMonth() + 1));

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_type: status === 'active' ? 'premium' : 'free',
          status,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString()
        });

      if (error) throw error;

      // Update profile subscription_plan
      await supabase
        .from('profiles')
        .update({ subscription_plan: status === 'active' ? 'premium' : 'free' })
        .eq('id', userId);

      toast({
        title: "Success",
        description: "Subscription updated successfully."
      });

      fetchManagementUsers();
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription.",
        variant: "destructive"
      });
    }
  };

  const handleGrantTemporaryAccess = async (userId: string) => {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + tempAccessDays);

      const { error } = await supabase
        .from('temporary_access')
        .insert({
          user_id: userId,
          features: { [tempAccessFeature]: true },
          granted_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          granted_via: 'admin_dashboard'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Granted ${tempAccessDays}-day access to ${tempAccessFeature}.`
      });

      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant temporary access.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard. Only administrators can view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor app performance and user engagement</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="management">
              <UserCog className="h-4 w-4 mr-2" />
              Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Free: {stats?.freeUsers}</Badge>
                    <Badge variant="default">Premium: {stats?.premiumUsers}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats?.activeSubscriptions || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${((stats?.totalRevenue || 0) / 100).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From ads and subscriptions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Check-ins:</span>
                      <span className="font-medium">{stats?.totalCheckins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Meals logged:</span>
                      <span className="font-medium">{stats?.totalMeals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Goals set:</span>
                      <span className="font-medium">{stats?.totalGoals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        user.subscription_plan === 'premium' || user.subscription_plan === 'pro' ? 'default' : 'outline'
                      }>
                        {user.subscription_plan === 'pro' ? 'premium' : user.subscription_plan}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Statistics</CardTitle>
                <CardDescription>How users are engaging with different features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.usageStats.map((usage) => (
                    <div key={usage.feature} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {usage.feature === 'ai_coaching' && <TrendingUp className="h-5 w-5 text-blue-500" />}
                        {usage.feature === 'nutrition_tracking' && <Utensils className="h-5 w-5 text-green-500" />}
                        {usage.feature === 'goal_setting' && <Target className="h-5 w-5 text-purple-500" />}
                        {usage.feature === 'wellness_checkin' && <Calendar className="h-5 w-5 text-orange-500" />}
                        <div>
                          <p className="font-medium capitalize">{usage.feature.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">Total interactions</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{usage.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Income sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="font-bold">${((stats?.totalRevenue || 0) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Premium Subscriptions</span>
                      <span>{stats?.premiumUsers} users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-bold">
                        {((stats?.activeSubscriptions || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Free Users</span>
                      <span>{stats?.freeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Paid Users</span>
                      <span>{stats?.premiumUsers || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.affiliateStats.totalClicks}</div>
                  <p className="text-xs text-muted-foreground">
                    All affiliate product clicks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.affiliateStats.totalConversions}</div>
                  <p className="text-xs text-muted-foreground">
                    Successful purchases tracked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.affiliateStats.conversionRate.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click-to-purchase ratio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Affiliate Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${((stats?.affiliateStats.affiliateRevenue || 0) / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Commission earned
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Products with the most clicks and conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.affiliateStats.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.conversions} conversions from {product.clicks} clicks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{product.clicks}</p>
                          <p className="text-xs text-muted-foreground">clicks</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{product.conversions}</p>
                          <p className="text-xs text-muted-foreground">conversions</p>
                        </div>
                        <Badge variant="secondary">
                          {product.clicks > 0 ? ((product.conversions / product.clicks) * 100).toFixed(1) : 0}% CVR
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {(!stats?.affiliateStats.topProducts || stats.affiliateStats.topProducts.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ExternalLink className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No affiliate clicks yet</p>
                      <p className="text-sm">Start promoting products to see analytics here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Click-Through Analytics</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average CTR</span>
                      <span className="font-bold">
                        {stats?.affiliateStats.conversionRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Total Clicks</span>
                      <span>{stats?.affiliateStats.totalClicks}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Successful Conversions</span>
                      <span>{stats?.affiliateStats.totalConversions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Impact</CardTitle>
                  <CardDescription>Commission breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Commission</span>
                      <span className="font-bold">
                        ${((stats?.affiliateStats.affiliateRevenue || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Avg. per Conversion</span>
                      <span>
                        ${stats?.affiliateStats.totalConversions ? 
                          ((stats.affiliateStats.affiliateRevenue / stats.affiliateStats.totalConversions) / 100).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Revenue Share</span>
                      <span>
                        {stats?.totalRevenue > 0 ? 
                          ((stats.affiliateStats.affiliateRevenue / stats.totalRevenue) * 100).toFixed(1) 
                          : '0'}% of total
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles, subscriptions, and access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {managementUsers.map((user) => (
                    <div key={user.id} className="p-6 border rounded-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-lg">{user.full_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          user.subscription_plan === 'premium' || user.subscription_plan === 'pro' 
                            ? 'default' 
                            : 'outline'
                        }>
                          {user.subscription_plan}
                        </Badge>
                      </div>

                      {/* Roles Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Roles</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role} variant="secondary" className="gap-2">
                                {role}
                                <button
                                  onClick={() => handleRemoveRole(user.id, role as 'admin' | 'moderator' | 'user')}
                                  className="hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No roles assigned</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignRole(user.id, 'admin')}
                            disabled={user.roles.includes('admin')}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Add Admin
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignRole(user.id, 'moderator')}
                            disabled={user.roles.includes('moderator')}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Add Moderator
                          </Button>
                        </div>
                      </div>

                      {/* Subscription Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Subscription</span>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={user.subscription_status || 'inactive'}
                            onValueChange={(value) => handleUpdateSubscription(user.id, value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active Premium</SelectItem>
                              <SelectItem value="inactive">Free Plan</SelectItem>
                            </SelectContent>
                          </Select>
                          {user.subscription_end && (
                            <div className="text-xs text-muted-foreground self-center">
                              Expires: {new Date(user.subscription_end).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Temporary Access Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Temporary Access</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedUser(user.id)}
                            >
                              <Gift className="h-3 w-3 mr-1" />
                              Grant Access
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Grant Temporary Access</DialogTitle>
                              <DialogDescription>
                                Give {user.full_name} temporary access to premium features
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="feature">Feature</Label>
                                <Select
                                  value={tempAccessFeature}
                                  onValueChange={setTempAccessFeature}
                                >
                                  <SelectTrigger id="feature">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ai_coaching">AI Coaching</SelectItem>
                                    <SelectItem value="nutrition_tracking">Nutrition Tracking</SelectItem>
                                    <SelectItem value="workout_planning">Workout Planning</SelectItem>
                                    <SelectItem value="goal_setting">Goal Setting</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="days">Duration (days)</Label>
                                <Input
                                  id="days"
                                  type="number"
                                  min="1"
                                  max="90"
                                  value={tempAccessDays}
                                  onChange={(e) => setTempAccessDays(parseInt(e.target.value))}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => handleGrantTemporaryAccess(user.id)}>
                                Grant Access
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}

                  {managementUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}