import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, LineChart, Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Education = () => {
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
    <section id="education" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Education & <span className="text-accent">Strategy</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Knowledge is your edge. Master the fundamentals and develop a winning mindset.
          </p>
        </div>

        {/* Core Topics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* Trading Philosophy */}
        <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-accent/30 mb-16">
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

        {/* FAQs */}
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
  );
};

export default Education;
