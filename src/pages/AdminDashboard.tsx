import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
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
  Utensils
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  proUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalCheckins: number;
  totalMeals: number;
  totalGoals: number;
  usageStats: {
    feature: string;
    count: number;
  }[];
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  subscription_plan: string;
  created_at: string;
  last_checkin?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    if (!user) return;
    
    try {
      // For demo purposes, check if user email is admin@test.com
      // In production, you would use proper role-based access control
      const isAdminUser = user.email === 'admin@test.com' || user.id === '550e8400-e29b-41d4-a716-446655440004';
      setIsAdmin(isAdminUser);
    } catch (error) {
      toast({
        title: "Access Error",
        description: "Could not verify admin access.",
        variant: "destructive"
      });
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user counts by subscription
      const { data: userCounts } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .then(result => {
          const counts = { free: 0, premium: 0, pro: 0 };
          result.data?.forEach(profile => {
            counts[profile.subscription_plan as keyof typeof counts] = 
              (counts[profile.subscription_plan as keyof typeof counts] || 0) + 1;
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
        totalUsers: (userCounts?.free || 0) + (userCounts?.premium || 0) + (userCounts?.pro || 0),
        freeUsers: userCounts?.free || 0,
        premiumUsers: userCounts?.premium || 0,
        proUsers: userCounts?.pro || 0,
        totalRevenue: revenueData || 0,
        activeSubscriptions: subscriptions?.length || 0,
        totalCheckins: checkins?.length || 0,
        totalMeals: meals?.length || 0,
        totalGoals: goals?.length || 0,
        usageStats: usageData || []
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

  if (!user) {
    return <Navigate to="/auth" replace />;
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
              You don't have permission to access the admin dashboard.
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
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
                    <Badge variant="outline">Pro: {stats?.proUsers}</Badge>
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
                        user.subscription_plan === 'pro' ? 'default' :
                        user.subscription_plan === 'premium' ? 'secondary' : 'outline'
                      }>
                        {user.subscription_plan}
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
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Pro Subscriptions</span>
                      <span>{stats?.proUsers} users</span>
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
                      <span>{(stats?.premiumUsers || 0) + (stats?.proUsers || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}