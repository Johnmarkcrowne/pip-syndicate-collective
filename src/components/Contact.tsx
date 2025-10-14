import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");

  const socials = [
    { icon: Instagram, name: "Instagram", link: "#", handle: "@pipsyndicate" },
    { icon: Twitter, name: "Twitter/X", link: "#", handle: "@pip_syndicate" },
    { icon: Youtube, name: "YouTube", link: "#", handle: "Pip Syndicate" },
    { icon: Mail, name: "Email", link: "mailto:hello@pipsyndicate.com", handle: "hello@pipsyndicate.com" },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Welcome to the Syndicate! Check your email for the free trading guide.");
    setNewsletterEmail("");
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Get In <span className="text-accent">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Want to join the community? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="bg-card border-border card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
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
                    placeholder="your@email.com"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={5}
                    className="bg-background border-border resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gradient-accent text-accent-foreground hover:opacity-90 transition-opacity">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social & Newsletter */}
          <div className="space-y-8">
            {/* Social Links */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Connect With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-accent/10 hover:border-accent/50 border border-transparent transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <social.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold group-hover:text-accent transition-colors">{social.name}</p>
                      <p className="text-sm text-muted-foreground">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30 card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Weekly Trading Newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get market insights, trading tips, and exclusive content delivered to your inbox every week.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    required
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-background border-border"
                  />
                  <Button type="submit" className="w-full gradient-accent text-accent-foreground hover:opacity-90 transition-opacity">
                    Subscribe & Get Free Guide
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    🎁 Free PDF: "3 Favorite High-Probability Trading Setups"
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
