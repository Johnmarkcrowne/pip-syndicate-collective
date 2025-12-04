import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { Calendar, Video, Users, Clock, ChevronLeft, ChevronRight, Crown, Lock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  instructor_id: string | null;
}

interface Subscription {
  id: string;
  type: string;
  status: string;
  ends_at: string | null;
}

const LiveClassesPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => authSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
    fetchClasses();
  }, [user, currentMonth]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!error && data) {
      setSubscription(data as Subscription);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString())
      .order("scheduled_at", { ascending: true });

    if (!error && data) {
      setClasses(data as LiveClass[]);
    }
    setLoading(false);
  };

  const hasActiveSubscription = subscription && subscription.status === "active";

  const getClassesForDate = (date: Date) => {
    return classes.filter(c => isSameDay(new Date(c.scheduled_at), date));
  };

  const handleJoinClass = (classItem: LiveClass) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!hasActiveSubscription) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to join live classes.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Joining Class",
      description: `Connecting to "${classItem.title}"...`,
    });
    // Video conferencing integration will go here
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const selectedDateClasses = selectedDate ? getClassesForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 mb-12">
          <div className="container mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-accent text-accent">
              <Video className="w-3 h-3 mr-1" />
              Live Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Live <span className="text-accent">Classes</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join interactive live sessions with our expert instructors. Learn trading strategies in real-time with Q&A.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subscription Status */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-accent" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="text-center py-4">
                      <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground mb-4">Sign in to access live classes</p>
                      <Button onClick={() => navigate("/auth")} className="w-full">
                        Sign In
                      </Button>
                    </div>
                  ) : hasActiveSubscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <Badge className="bg-accent text-accent-foreground capitalize">
                          {subscription?.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          Active
                        </Badge>
                      </div>
                      {subscription?.ends_at && subscription.type !== "lifetime" && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Renews</span>
                          <span className="text-sm">{format(new Date(subscription.ends_at), "MMM d, yyyy")}</span>
                        </div>
                      )}
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-green-500 flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          You have full access to all live classes
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Subscribe to join live classes with our expert instructors.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Monthly</span>
                          <span className="font-bold">$29/mo</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Yearly</span>
                          <span className="font-bold">$249/yr</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-accent/10 border border-accent">
                          <span>Lifetime</span>
                          <span className="font-bold text-accent">$499</span>
                        </div>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Subscribe Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Classes List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" />
                    Upcoming Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classes.filter(c => new Date(c.scheduled_at) > new Date()).slice(0, 3).length > 0 ? (
                    <div className="space-y-3">
                      {classes
                        .filter(c => new Date(c.scheduled_at) > new Date())
                        .slice(0, 3)
                        .map((classItem) => (
                          <div key={classItem.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                            <p className="font-medium text-sm">{classItem.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(classItem.scheduled_at), "MMM d 'at' h:mm a")}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No upcoming classes scheduled
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      Class Schedule
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="font-medium min-w-[140px] text-center">
                        {format(currentMonth, "MMMM yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before the first of the month */}
                    {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {days.map((day) => {
                      const dayClasses = getClassesForDate(day);
                      const hasClasses = dayClasses.length > 0;
                      const isSelected = selectedDate && isSameDay(day, selectedDate);

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all
                            ${isToday(day) ? "bg-accent/20 text-accent font-bold" : ""}
                            ${isSelected ? "ring-2 ring-accent bg-accent/10" : "hover:bg-muted/50"}
                            ${hasClasses ? "relative" : ""}
                          `}
                        >
                          {format(day, "d")}
                          {hasClasses && (
                            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-accent" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Date Classes */}
                  {selectedDate && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="font-heading font-semibold mb-4">
                        Classes on {format(selectedDate, "MMMM d, yyyy")}
                      </h3>
                      {selectedDateClasses.length > 0 ? (
                        <div className="space-y-4">
                          {selectedDateClasses.map((classItem) => (
                            <Card key={classItem.id} className="bg-muted/30 border-border">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-medium mb-1">{classItem.title}</h4>
                                    {classItem.description && (
                                      <p className="text-sm text-muted-foreground mb-3">
                                        {classItem.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(classItem.scheduled_at), "h:mm a")}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Video className="w-3 h-3" />
                                        {classItem.duration_minutes} min
                                      </span>
                                      <Badge variant="outline" className="text-xs capitalize">
                                        {classItem.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => handleJoinClass(classItem)}
                                    disabled={classItem.status === "ended" || classItem.status === "cancelled"}
                                    className={hasActiveSubscription ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                                  >
                                    {!user ? "Sign In" : !hasActiveSubscription ? (
                                      <>
                                        <Lock className="w-4 h-4 mr-1" />
                                        Subscribe
                                      </>
                                    ) : classItem.status === "live" ? (
                                      "Join Now"
                                    ) : (
                                      "Join Class"
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No classes scheduled for this date
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveClassesPage;