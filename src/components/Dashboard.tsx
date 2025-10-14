import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BarChart3, Calendar, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const tools = [
    {
      icon: BarChart3,
      name: "TradingView",
      description: "Live charts & technical analysis tools",
      link: "https://www.tradingview.com/",
    },
    {
      icon: Calendar,
      name: "Forex Factory",
      description: "Economic calendar & market news",
      link: "https://www.forexfactory.com/",
    },
    {
      icon: Newspaper,
      name: "FXStreet",
      description: "Real-time forex news & analysis",
      link: "https://www.fxstreet.com/",
    },
  ];

  const majorPairs = [
    { pair: "EUR/USD", change: "+0.42%", trending: "up" },
    { pair: "GBP/JPY", change: "-0.28%", trending: "down" },
    { pair: "USD/JPY", change: "+0.15%", trending: "up" },
    { pair: "AUD/USD", change: "+0.33%", trending: "up" },
  ];

  return (
    <section id="dashboard" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Market <span className="text-accent">Dashboard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay ahead of the market. Access real-time data and professional trading tools in one place.
          </p>
        </div>

        {/* Quick Market Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {majorPairs.map((item, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pair</p>
                    <p className="text-xl font-heading font-bold">{item.pair}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">24h</p>
                    <p className={`text-lg font-bold ${item.trending === "up" ? "text-accent" : "text-destructive"}`}>
                      {item.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Tools */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-accent/50 text-accent hover:bg-accent/10"
                  onClick={() => window.open(tool.link, "_blank")}
                >
                  Open Tool
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TradingView Embed */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Live Market Charts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[600px] bg-muted/50 flex items-center justify-center">
              <div className="text-center p-8">
                <BarChart3 className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground">
                  TradingView widget integration available.
                  <br />
                  <span className="text-sm">Connect your TradingView account to view live charts.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
