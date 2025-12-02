import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldOff, Loader2, ArrowLeft, UserCog } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  is_admin: boolean;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      fetchUsers();
    }
  }, [isAdmin, adminLoading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      if (!profiles) return;

      // Fetch all admin roles
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      const adminUserIds = new Set(adminRoles?.map(r => r.user_id) || []);

      const usersWithRoles: UserWithRole[] = profiles.map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        created_at: profile.created_at,
        is_admin: adminUserIds.has(profile.id)
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAdmin = async (userId: string) => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin role granted successfully."
      });

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant admin role.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin role revoked successfully."
      });

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke admin role.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-6 w-6 text-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>
              Grant or revoke admin roles for users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell className="font-medium">
                        {userItem.email}
                      </TableCell>
                      <TableCell>
                        {userItem.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {userItem.is_admin ? (
                          <Badge variant="default" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">User</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {userItem.is_admin ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeAdmin(userItem.id)}
                            disabled={updating === userItem.id || userItem.id === user.id}
                          >
                            {updating === userItem.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ShieldOff className="h-4 w-4 mr-2" />
                                Revoke Admin
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleGrantAdmin(userItem.id)}
                            disabled={updating === userItem.id}
                          >
                            {updating === userItem.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Grant Admin
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
