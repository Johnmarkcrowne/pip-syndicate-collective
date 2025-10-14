import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Video, Trophy, ArrowRight } from "lucide-react";

const Community = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Live Chat & Discussion",
      description: "Connect with traders 24/7. Share ideas, ask questions, and collaborate in real-time.",
    },
    {
      icon: Video,
      title: "Weekly Live Sessions",
      description: "Join our live trading sessions, webinars, and Q&A every week. Learn by watching pros in action.",
    },
    {
      icon: Users,
      title: "Mentorship Program",
      description: "Get personalized guidance from experienced traders. 1-on-1 sessions and group workshops available.",
    },
    {
      icon: Trophy,
      title: "Trading Challenges",
      description: "Participate in monthly challenges. Test your skills, win prizes, and level up your game.",
    },
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Member since 2023",
      text: "This community changed my trading completely. The transparency and education are next level. I went from losing consistently to having my first profitable quarter.",
    },
    {
      name: "Jordan Lee",
      role: "Member since 2024",
      text: "Finally found a group that doesn't sell hype. Real traders, real results, real education. The mentorship helped me avoid thousands in costly mistakes.",
    },
    {
      name: "Sam Patel",
      role: "Member since 2023",
      text: "The live sessions are gold. Watching Marcus and Sarah trade live taught me more in 3 months than 2 years of YouTube videos. Worth every penny.",
    },
  ];

  return (
    <section id="community" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Join Our <span className="text-accent">Community</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trading doesn't have to be lonely. Connect with like-minded traders, share insights, and grow together.
          </p>
        </div>

        {/* Community Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg gradient-primary mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner */}
        <Card className="bg-gradient-to-r from-primary to-primary-glow border-primary/50 mb-16 card-shadow overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
              Ready to Level Up Your Trading?
            </h3>
            <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              Join over 5,000 traders who are mastering the markets together. Get instant access to our Discord community, weekly live sessions, and exclusive resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-accent text-accent-foreground hover:opacity-90 transition-opacity text-lg px-8 py-6 glow-accent"
              >
                Join Discord Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
              >
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-3xl font-heading font-bold mb-8 text-center">
            What Our <span className="text-accent">Traders</span> Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-lg font-heading font-bold text-accent-foreground">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-heading font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
