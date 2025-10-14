const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="text-2xl font-heading font-bold text-accent-foreground">P</span>
              </div>
              <span className="text-2xl font-heading font-bold">
                Pip <span className="text-accent">Syndicate</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-md mb-4">
              Building a transparent, educational forex trading community. Master the markets together through real insights and professional strategies.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Pip Syndicate. All rights reserved.
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
