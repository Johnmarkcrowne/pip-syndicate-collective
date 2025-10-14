import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Handshake, TrendingUp, Users2, Megaphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Partner = () => {
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    proposal: "",
  });

  const benefits = [
    {
      icon: Users2,
      title: "Growing Audience",
      description: "Access to 5,000+ active traders and growing community",
    },
    {
      icon: TrendingUp,
      title: "Trading Credibility",
      description: "Partner with experienced traders with proven track records",
    },
    {
      icon: Megaphone,
      title: "Brand Exposure",
      description: "Featured across our platform, social media, and events",
    },
    {
      icon: Handshake,
      title: "Revenue Share",
      description: "Competitive affiliate programs and sponsorship opportunities",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll review your proposal and get back to you soon.");
    setFormData({ name: "", business: "", email: "", proposal: "" });
  };

  return (
    <section id="partner" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Partner <span className="text-accent">With Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collaborate with us to reach engaged traders and grow together. We're looking for brokers, tools, educators, and content creators.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg gradient-accent mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Partner Types */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6">Who We Partner With</h3>
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold text-lg mb-2">Forex Brokers</h4>
                  <p className="text-muted-foreground text-sm">
                    Regulated brokers offering competitive spreads and great trading conditions for our community.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold text-lg mb-2">Trading Tools & Software</h4>
                  <p className="text-muted-foreground text-sm">
                    Indicators, EAs, analytics platforms, and other tools that add value to traders.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold text-lg mb-2">Educational Platforms</h4>
                  <p className="text-muted-foreground text-sm">
                    Courses, mentorship programs, and learning resources that align with our values.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold text-lg mb-2">Content Creators</h4>
                  <p className="text-muted-foreground text-sm">
                    YouTubers, influencers, and media outlets in the trading space.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-card border-border card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Submit Your Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Business / Organization</label>
                  <Input
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    placeholder="Your Company Name"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Partnership Proposal</label>
                  <Textarea
                    required
                    value={formData.proposal}
                    onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                    placeholder="Tell us about your business and how we can work together..."
                    rows={5}
                    className="bg-background border-border resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gradient-accent text-accent-foreground hover:opacity-90 transition-opacity">
                  Submit Proposal
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Partner;
