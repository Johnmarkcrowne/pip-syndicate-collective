import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, UserPlus, Crown, Trash2 } from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';

interface Profile {
  id: string;
  email: string | null;
}

interface Subscription {
  id: string;
  user_id: string;
  type: 'monthly' | 'yearly' | 'lifetime';
  status: string;
  starts_at: string;
  ends_at: string | null;
  profiles?: Profile;
}

export function SubscriptionManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch profile emails for each subscription
      const userIds = data.map(s => s.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const subsWithProfiles = data.map(sub => ({
        ...sub,
        profiles: profilesData?.find(p => p.id === sub.user_id)
      }));

      setSubscriptions(subsWithProfiles as Subscription[]);
    }
  };

  const searchUsers = async () => {
    if (!searchEmail.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .ilike('email', `%${searchEmail}%`)
      .limit(10);

    if (data) {
      setProfiles(data);
    }
    setLoading(false);
  };

  const grantSubscription = async () => {
    if (!selectedUserId) {
      toast({
        title: 'Error',
        description: 'Please select a user first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Calculate end date based on subscription type
    const startsAt = new Date();
    let endsAt: Date | null = null;

    if (subscriptionType === 'monthly') {
      endsAt = addMonths(startsAt, 1);
    } else if (subscriptionType === 'yearly') {
      endsAt = addYears(startsAt, 1);
    }
    // lifetime has no end date

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: selectedUserId,
        type: subscriptionType,
        status: 'active',
        starts_at: startsAt.toISOString(),
        ends_at: endsAt?.toISOString() || null,
      });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Subscription granted successfully',
      });
      setSelectedUserId('');
      setSearchEmail('');
      setProfiles([]);
      fetchSubscriptions();
    }

    setLoading(false);
  };

  const revokeSubscription = async (subscriptionId: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Subscription Revoked',
        description: 'The subscription has been cancelled',
      });
      fetchSubscriptions();
    }
  };

  const selectedProfile = profiles.find(p => p.id === selectedUserId);

  return (
    <div className="space-y-6">
      {/* Grant Subscription Form */}
      <div className="p-4 rounded-lg border border-border bg-card/50 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-accent" />
          Grant New Subscription
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Search User by Email</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
              />
              <Button variant="outline" size="icon" onClick={searchUsers} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subscription Type</Label>
            <Select value={subscriptionType} onValueChange={(v) => setSubscriptionType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results */}
        {profiles.length > 0 && (
          <div className="space-y-2">
            <Label>Select User</Label>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedUserId(profile.id)}
                  className={`p-2 text-left text-sm rounded border transition-colors ${
                    selectedUserId === profile.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  {profile.email || 'No email'}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedProfile && (
          <div className="p-3 rounded bg-accent/10 border border-accent/30 text-sm">
            <p>
              <strong>Selected:</strong> {selectedProfile.email}
            </p>
            <p className="text-muted-foreground">
              Will receive: <strong>{subscriptionType}</strong> subscription
            </p>
          </div>
        )}

        <Button
          onClick={grantSubscription}
          disabled={!selectedUserId || loading}
          className="w-full bg-accent hover:bg-accent/90"
        >
          <Crown className="h-4 w-4 mr-2" />
          Grant Subscription
        </Button>
      </div>

      {/* Active Subscriptions */}
      <div className="space-y-4">
        <h3 className="font-semibold">Active Subscriptions ({subscriptions.length})</h3>

        {subscriptions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active subscriptions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.profiles?.email || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {sub.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(sub.starts_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.ends_at ? format(new Date(sub.ends_at), 'MMM d, yyyy') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => revokeSubscription(sub.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
