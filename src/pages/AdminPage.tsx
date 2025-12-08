import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, BarChart3, GraduationCap, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleClassForm } from '@/components/admin/ScheduleClassForm';
import { ClassesList } from '@/components/admin/ClassesList';
import { ParticipantsList } from '@/components/admin/ParticipantsList';
import { ClassAnalytics } from '@/components/admin/ClassAnalytics';
import { SubscriptionManager } from '@/components/admin/SubscriptionManager';

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user has instructor or admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasAccess = roles?.some(r => r.role === 'instructor' || r.role === 'admin');
    
    if (!hasAccess) {
      navigate('/');
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your classes, participants, and view analytics</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Participants</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Schedule New Class</CardTitle>
                  <CardDescription>Create a new live class session</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleClassForm onClassCreated={() => setRefreshTrigger(r => r + 1)} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Classes</CardTitle>
                  <CardDescription>Manage scheduled and past classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClassesList refreshTrigger={refreshTrigger} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Manage Participants</CardTitle>
                <CardDescription>View and manage class participants</CardDescription>
              </CardHeader>
              <CardContent>
                <ParticipantsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Manage Subscriptions</CardTitle>
                <CardDescription>Grant or revoke user subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <ClassAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
