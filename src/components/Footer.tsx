import { Mail, MessageCircle, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/fxpulse", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/@fxpulse", label: "YouTube" },
    { icon: MessageCircle, href: "https://discord.gg/fxpulse", label: "Discord" },
    { icon: Mail, href: "mailto:hello@fxpulse.com", label: "Email" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="text-lg font-heading font-bold text-accent-foreground">FX</span>
              </div>
              <span className="text-2xl font-heading font-bold">
                FX<span className="text-accent">Pulse</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              Building a transparent, educational forex trading community. Master the markets together through real insights and professional strategies.
            </p>
            {/* Social Buttons - Responsive */}
            <div className="flex flex-wrap gap-2 mb-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  className="border-border hover:border-accent hover:bg-accent/10 transition-all"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 FX Pulse. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-accent transition-colors">About Us</a>
              </li>
              <li>
                <a href="#education" className="hover:text-accent transition-colors">Education</a>
              </li>
              <li>
                <a href="#community" className="hover:text-accent transition-colors">Community</a>
              </li>
              <li>
                <a href="#partner" className="hover:text-accent transition-colors">Partner With Us</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Risk Disclaimer</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Risk Warning:</strong> Trading forex carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. You should carefully consider your investment objectives, level of experience, and risk appetite before trading.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
