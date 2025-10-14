import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-accent-foreground">P</span>
            </div>
            <span className="text-2xl font-heading font-bold">
              Pip <span className="text-accent">Syndicate</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("dashboard")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Education
            </button>
            <button
              onClick={() => scrollToSection("community")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </button>
            <button
              onClick={() => scrollToSection("partner")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Partner
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-fade-in-up">
            <button
              onClick={() => scrollToSection("about")}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("dashboard")}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Education
            </button>
            <button
              onClick={() => scrollToSection("community")}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </button>
            <button
              onClick={() => scrollToSection("partner")}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Partner
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
