import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Trading charts and market data"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Live Trading Community</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Master the Markets.
            <br />
            <span className="text-accent">Trade Together.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join a fast-growing community of traders. Learn, trade, and grow with us through transparent insights and real-time analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="gradient-accent text-accent-foreground hover:opacity-90 transition-opacity text-lg px-8 py-6 glow-accent"
              onClick={() => scrollToSection("community")}
            >
              Join the Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-accent/50 text-accent hover:bg-accent/10 text-lg px-8 py-6"
              onClick={() => scrollToSection("about")}
            >
              Our Strategy
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">5K+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">20+</div>
              <div className="text-sm text-muted-foreground">Years Combined Experience</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Transparent Trading</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
