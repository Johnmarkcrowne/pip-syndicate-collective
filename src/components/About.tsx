import { Card, CardContent } from "@/components/ui/card";
import { Target, Shield, TrendingUp, Users } from "lucide-react";

const About = () => {
  const founders = [
    {
      name: "Marcus Chen",
      role: "Lead Scalper & Technical Analyst",
      experience: "12 years",
      style: "Precision scalping on EUR/USD and GBP/JPY pairs",
      bio: "Started trading in 2012, Marcus developed a systematic approach combining price action with volume analysis. Known for his discipline and risk management, he's helped hundreds of traders refine their entries and exits.",
    },
    {
      name: "Sarah Thompson",
      role: "Swing Trader & Strategy Developer",
      experience: "8 years",
      style: "Multi-timeframe analysis and position trading",
      bio: "With a background in economics, Sarah brings fundamental analysis into the mix. She specializes in catching major trend reversals and teaches traders how to align with institutional flow.",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description: "Every trade, win or loss, is shared with the community. No smoke and mirrors.",
    },
    {
      icon: Target,
      title: "Education First",
      description: "We believe in teaching you to fish, not just giving you the fish.",
    },
    {
      icon: TrendingUp,
      title: "Discipline",
      description: "Trading is 90% psychology. We help you build the mindset of a pro.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Trading doesn't have to be lonely. Grow alongside like-minded traders.",
    },
  ];

  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Meet the <span className="text-accent">Founders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two experienced traders who came together with a shared mission: build a transparent, educational community that empowers independent traders.
          </p>
        </div>

        {/* Founders */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {founders.map((founder, index) => (
            <Card key={index} className="bg-card border-border card-shadow hover:border-accent/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center text-2xl font-heading font-bold text-accent-foreground flex-shrink-0">
                    {founder.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold mb-1 group-hover:text-accent transition-colors">
                      {founder.name}
                    </h3>
                    <p className="text-accent text-sm font-medium mb-1">{founder.role}</p>
                    <p className="text-muted-foreground text-sm">{founder.experience} experience</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium text-accent mb-1">Trading Style</p>
                    <p className="text-sm text-muted-foreground">{founder.style}</p>
                  </div>
                  <p className="text-foreground/90 leading-relaxed">{founder.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-heading font-bold mb-4">Our Mission</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're building more than a trading group—we're creating a movement. A place where transparency beats hype, education beats shortcuts, and community beats isolation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-heading font-bold mb-2 group-hover:text-accent transition-colors">
                  {value.title}
                </h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
