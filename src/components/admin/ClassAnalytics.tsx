import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface AnalyticsData {
  totalClasses: number;
  totalParticipants: number;
  avgParticipantsPerClass: number;
  upcomingClasses: number;
  classesOverTime: { date: string; count: number }[];
  participantsOverTime: { date: string; count: number }[];
}

export function ClassAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClasses: 0,
    totalParticipants: 0,
    avgParticipantsPerClass: 0,
    upcomingClasses: 0,
    classesOverTime: [],
    participantsOverTime: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    // Fetch all classes
    const { data: classes } = await supabase
      .from('classes')
      .select('id, scheduled_at, status');
    
    // Fetch all participants
    const { data: participants } = await supabase
      .from('class_participants')
      .select('id, class_id, joined_at');
    
    if (classes && participants) {
      const now = new Date();
      const totalClasses = classes.length;
      const totalParticipants = participants.length;
      const upcomingClasses = classes.filter(c => new Date(c.scheduled_at) > now).length;
      const avgParticipantsPerClass = totalClasses > 0 ? Math.round(totalParticipants / totalClasses) : 0;

      // Classes over last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(now, 29 - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        const count = classes.filter(c => {
          const scheduled = new Date(c.scheduled_at);
          return scheduled >= dayStart && scheduled <= dayEnd;
        }).length;
        return { date: format(date, 'MMM d'), count };
      });

      // Participants over last 30 days
      const participantsLast30 = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(now, 29 - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        const count = participants.filter(p => {
          const joined = new Date(p.joined_at);
          return joined >= dayStart && joined <= dayEnd;
        }).length;
        return { date: format(date, 'MMM d'), count };
      });

      setAnalytics({
        totalClasses,
        totalParticipants,
        avgParticipantsPerClass,
        upcomingClasses,
        classesOverTime: last30Days,
        participantsOverTime: participantsLast30
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClasses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalParticipants}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Class</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgParticipantsPerClass}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.upcomingClasses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Classes Scheduled (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.classesOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participant Joins (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.participantsOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
