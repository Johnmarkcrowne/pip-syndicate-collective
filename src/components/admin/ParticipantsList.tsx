import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Participant {
  id: string;
  user_id: string;
  joined_at: string;
  left_at: string | null;
  email?: string;
}

interface ClassOption {
  id: string;
  title: string;
  scheduled_at: string;
}

export function ParticipantsList() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchParticipants(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from('classes')
      .select('id, title, scheduled_at')
      .order('scheduled_at', { ascending: false });
    
    if (data) {
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0].id);
    }
  };

  const fetchParticipants = async (classId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('class_participants')
      .select('*')
      .eq('class_id', classId)
      .order('joined_at', { ascending: true });
    
    if (data) {
      // Fetch emails from profiles
      const userIds = data.map(p => p.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
      
      const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || []);
      setParticipants(data.map(p => ({ ...p, email: emailMap.get(p.user_id) || 'Unknown' })));
    }
    setLoading(false);
  };

  const removeParticipant = async (participantId: string) => {
    const { error } = await supabase
      .from('class_participants')
      .update({ left_at: new Date().toISOString() })
      .eq('id', participantId);
    
    if (!error) {
      fetchParticipants(selectedClass);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.title} - {format(new Date(cls.scheduled_at), 'MMM d, yyyy')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {participants.filter(p => !p.left_at).length} active
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading participants...</div>
      ) : participants.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No participants have joined this class yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.email}</TableCell>
                <TableCell>{format(new Date(participant.joined_at), 'PPp')}</TableCell>
                <TableCell>
                  <Badge variant={participant.left_at ? 'secondary' : 'default'}>
                    {participant.left_at ? 'Left' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {!participant.left_at && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
