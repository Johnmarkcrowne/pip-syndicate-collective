import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, LineChart, Shield, Play } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EducationPage = () => {
  const topics = [
    {
      icon: LineChart,
      title: "Technical Analysis",
      description: "Master chart patterns, indicators, and price action strategies used by professionals.",
    },
    {
      icon: Brain,
      title: "Trading Psychology",
      description: "Develop the mental discipline and emotional control needed for consistent trading.",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Learn position sizing, stop-loss strategies, and how to protect your capital.",
    },
    {
      icon: BookOpen,
      title: "Strategy Development",
      description: "Build and backtest your own trading system with proven methodologies.",
    },
  ];

  const videos = [
    {
      title: "Forex Basics: Getting Started",
      description: "Learn the fundamentals of forex trading, currency pairs, and how the market works.",
      duration: "15:30",
      thumbnail: "gradient-primary",
    },
    {
      title: "Reading Price Action Like a Pro",
      description: "Master candlestick patterns, support/resistance, and trend identification.",
      duration: "22:45",
      thumbnail: "gradient-accent",
    },
    {
      title: "Risk Management Essentials",
      description: "Protect your capital with proper position sizing and stop-loss placement.",
      duration: "18:20",
      thumbnail: "gradient-primary",
    },
    {
      title: "Trading Psychology Masterclass",
      description: "Control emotions, avoid revenge trading, and develop a winning mindset.",
      duration: "25:10",
      thumbnail: "gradient-accent",
    },
    {
      title: "Building Your First Strategy",
      description: "Step-by-step guide to creating and testing your own trading system.",
      duration: "30:00",
      thumbnail: "gradient-primary",
    },
    {
      title: "Advanced Technical Indicators",
      description: "Deep dive into RSI, MACD, Bollinger Bands, and how to combine them.",
      duration: "28:15",
      thumbnail: "gradient-accent",
    },
  ];

  const faqs = [
    {
      question: "What is forex trading?",
      answer: "Forex (foreign exchange) trading is the buying and selling of currencies in the global market. It's the largest and most liquid financial market in the world, with over $6 trillion traded daily. Traders profit from the fluctuations in exchange rates between currency pairs.",
    },
    {
      question: "How do I start trading forex?",
      answer: "Start with education—understand the basics, learn risk management, and practice with a demo account. Choose a regulated broker, develop a trading plan, and start with small positions. Never risk more than you can afford to lose, and always use stop-losses.",
    },
    {
      question: "What's your trading system?",
      answer: "Our approach combines multi-timeframe analysis, price action patterns, volume confirmation, and strict risk management. We focus on high-probability setups with favorable risk-reward ratios (minimum 1:2). Every trade has a defined entry, stop-loss, and take-profit level before execution.",
    },
    {
      question: "Do you provide trading signals?",
      answer: "We share our analysis and trade ideas with the community, but our focus is on education. We want you to understand WHY we take trades, not just copy them blindly. This builds your skills for long-term independence.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 animate-fade-in-up">
              Education & <span className="text-accent">Strategy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Knowledge is your edge. Master the fundamentals and develop a winning mindset through our comprehensive learning resources.
            </p>
          </div>
        </section>

        {/* Core Topics */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topics.map((topic, index) => (
                <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-lg gradient-accent mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <topic.icon className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{topic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Library */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">
                Video <span className="text-accent">Library</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn at your own pace with our curated collection of trading education videos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group cursor-pointer overflow-hidden">
                  <div className={`aspect-video ${video.thumbnail} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-accent-foreground ml-1" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trading Philosophy */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-accent/30">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-center">Our Trading Philosophy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-accent mb-2">80/20</div>
                    <p className="text-sm text-muted-foreground">Focus on high-probability setups</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-accent mb-2">1-2%</div>
                    <p className="text-sm text-muted-foreground">Risk per trade maximum</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-accent mb-2">1:2+</div>
                    <p className="text-sm text-muted-foreground">Minimum risk-reward ratio</p>
                  </div>
                </div>
                <p className="text-center text-foreground/90 max-w-3xl mx-auto pt-4">
                  We trade what we see, not what we think. Price action tells the truth. Our system is built on patience, discipline, and letting winners run while cutting losers fast.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-heading font-bold mb-8 text-center">
                Frequently Asked <span className="text-accent">Questions</span>
              </h3>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-heading font-semibold hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EducationPage;
