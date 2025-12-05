import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Square, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type ClassStatus = Database['public']['Enums']['class_status'];

interface ClassItem {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  status: ClassStatus;
  participant_count?: number;
}

interface ClassesListProps {
  refreshTrigger: number;
}

export function ClassesList({ refreshTrigger }: ClassesListProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, [refreshTrigger]);

  const fetchClasses = async () => {
    setLoading(true);
    const { data: classesData } = await supabase
      .from('classes')
      .select('*')
      .order('scheduled_at', { ascending: false });

    if (classesData) {
      // Get participant counts
      const { data: participants } = await supabase
        .from('class_participants')
        .select('class_id');

      const countMap = new Map<string, number>();
      participants?.forEach(p => {
        countMap.set(p.class_id, (countMap.get(p.class_id) || 0) + 1);
      });

      setClasses(classesData.map(c => ({
        ...c,
        participant_count: countMap.get(c.id) || 0
      })));
    }
    setLoading(false);
  };

  const updateStatus = async (classId: string, status: ClassStatus) => {
    const { error } = await supabase
      .from('classes')
      .update({ status })
      .eq('id', classId);

    if (error) {
      toast.error('Failed to update class status');
    } else {
      toast.success(`Class ${status}`);
      fetchClasses();
    }
  };

  const getStatusColor = (status: ClassStatus) => {
    switch (status) {
      case 'scheduled': return 'secondary';
      case 'live': return 'default';
      case 'ended': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading classes...</div>;
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No classes scheduled yet. Create your first class above!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((cls) => (
          <TableRow key={cls.id}>
            <TableCell className="font-medium">{cls.title}</TableCell>
            <TableCell>{format(new Date(cls.scheduled_at), 'PPp')}</TableCell>
            <TableCell>{cls.duration_minutes} min</TableCell>
            <TableCell>{cls.participant_count} / {cls.max_participants}</TableCell>
            <TableCell>
              <Badge variant={getStatusColor(cls.status)}>
                {cls.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {cls.status === 'scheduled' && (
                    <DropdownMenuItem onClick={() => updateStatus(cls.id, 'live')}>
                      <Play className="mr-2 h-4 w-4" /> Start Class
                    </DropdownMenuItem>
                  )}
                  {cls.status === 'live' && (
                    <DropdownMenuItem onClick={() => updateStatus(cls.id, 'ended')}>
                      <Square className="mr-2 h-4 w-4" /> End Class
                    </DropdownMenuItem>
                  )}
                  {cls.status !== 'cancelled' && cls.status !== 'ended' && (
                    <DropdownMenuItem 
                      onClick={() => updateStatus(cls.id, 'cancelled')}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Cancel Class
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
