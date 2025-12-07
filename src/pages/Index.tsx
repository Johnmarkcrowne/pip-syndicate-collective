import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Dashboard from "@/components/Dashboard";
import Community from "@/components/Community";
import Partner from "@/components/Partner";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Dashboard />
        <Community />
        <Partner />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
