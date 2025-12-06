import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { ArrowLeft, Users, Clock, Video, MessageSquare, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import JitsiRoom from "@/components/JitsiRoom";

interface ClassDetails {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  instructor_id: string | null;
  room_id: string | null;
}

interface Participant {
  id: string;
  user_id: string;
  joined_at: string;
  profiles?: {
    email: string | null;
  };
}

const ClassroomPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inRoom, setInRoom] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && classId) {
      checkAccess();
      fetchClassDetails();
      fetchParticipants();
    } else if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, classId]);

  const checkAccess = async () => {
    if (!user) return;

    // Check subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    // Check if instructor or admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isInstructorOrAdmin = roles?.some(r => r.role === "instructor" || r.role === "admin");
    setIsInstructor(isInstructorOrAdmin || false);
    setHasAccess(!!subscription || isInstructorOrAdmin || false);
    setLoading(false);
  };

  const fetchClassDetails = async () => {
    if (!classId) return;

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("id", classId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load class details",
        variant: "destructive",
      });
      navigate("/live-classes");
      return;
    }

    setClassDetails(data as ClassDetails);
  };

  const fetchParticipants = async () => {
    if (!classId) return;

    const { data } = await supabase
      .from("class_participants")
      .select("id, user_id, joined_at")
      .eq("class_id", classId)
      .is("left_at", null);

    if (data) {
      // Fetch profile emails separately
      const userIds = data.map(p => p.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);
      
      const participantsWithProfiles = data.map(p => ({
        ...p,
        profiles: profiles?.find(pr => pr.id === p.user_id) || { email: null }
      }));
      
      setParticipants(participantsWithProfiles as Participant[]);
    }
  };

  const joinClass = async () => {
    if (!user || !classId) return;

    // Record participation
    await supabase
      .from("class_participants")
      .upsert({
        class_id: classId,
        user_id: user.id,
        joined_at: new Date().toISOString(),
      }, {
        onConflict: "class_id,user_id",
      });

    setInRoom(true);
    fetchParticipants();
  };

  const leaveClass = async () => {
    if (!user || !classId) return;

    await supabase
      .from("class_participants")
      .update({ left_at: new Date().toISOString() })
      .eq("class_id", classId)
      .eq("user_id", user.id);

    setInRoom(false);
    navigate("/live-classes");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-accent text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-card border-border">
          <CardContent className="pt-6 text-center">
            <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-heading font-bold mb-2">Access Required</h2>
            <p className="text-muted-foreground mb-6">
              You need an active subscription to join live classes.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/live-classes")} className="w-full bg-accent hover:bg-accent/90">
                View Subscription Options
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => inRoom ? leaveClass() : navigate("/live-classes")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-heading font-bold text-lg">
                {classDetails?.title || "Live Class"}
              </h1>
              {classDetails && (
                <p className="text-xs text-muted-foreground">
                  {format(new Date(classDetails.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-accent text-accent">
              <Users className="w-3 h-3 mr-1" />
              {participants.length} in class
            </Badge>
            {isInstructor && (
              <Badge className="bg-accent text-accent-foreground">
                Instructor
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {!inRoom ? (
            // Pre-join Screen
            <div className="max-w-2xl mx-auto mt-12">
              <Card className="bg-card border-border">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Video className="w-10 h-10 text-accent" />
                  </div>
                  <CardTitle className="text-2xl font-heading">
                    Ready to Join?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {classDetails && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                        <h3 className="font-semibold">{classDetails.title}</h3>
                        {classDetails.description && (
                          <p className="text-sm text-muted-foreground">
                            {classDetails.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {classDetails.duration_minutes} minutes
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {participants.length} participants
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-lg bg-accent/10">
                          <MessageSquare className="w-6 h-6 mx-auto text-accent mb-1" />
                          <p className="text-xs text-muted-foreground">Live Chat</p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent/10">
                          <Hand className="w-6 h-6 mx-auto text-accent mb-1" />
                          <p className="text-xs text-muted-foreground">Raise Hand</p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent/10">
                          <Video className="w-6 h-6 mx-auto text-accent mb-1" />
                          <p className="text-xs text-muted-foreground">HD Video</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={joinClass}
                    className="w-full h-12 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Join Classroom
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // In-room View
            <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
              {/* Video Area */}
              <div className="lg:col-span-3">
                <JitsiRoom
                  roomName={classDetails?.room_id || classDetails?.id || "default-room"}
                  displayName={user?.email?.split("@")[0] || "Trader"}
                  isInstructor={isInstructor}
                  onLeave={leaveClass}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      Participants ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 text-sm p-2 rounded bg-muted/30"
                        >
                          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-medium">
                            {p.profiles?.email?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="truncate text-xs">
                            {p.profiles?.email?.split("@")[0] || "Anonymous"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="py-4 text-center">
                    <Button
                      variant="destructive"
                      onClick={leaveClass}
                      className="w-full"
                    >
                      Leave Class
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClassroomPage;
