import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BarChart3, Calendar, Newspaper, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const Dashboard = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "lineWidth": 2,
      "lineType": 0,
      "chartType": "area",
      "fontColor": "rgb(106, 109, 120)",
      "gridLineColor": "rgba(46, 46, 46, 0.06)",
      "volumeUpColor": "rgba(34, 171, 148, 0.5)",
      "volumeDownColor": "rgba(247, 82, 95, 0.5)",
      "backgroundColor": "#ffffff",
      "widgetFontColor": "#0F0F0F",
      "upColor": "#22ab94",
      "downColor": "#f7525f",
      "borderUpColor": "#22ab94",
      "borderDownColor": "#f7525f",
      "wickUpColor": "#22ab94",
      "wickDownColor": "#f7525f",
      "colorTheme": "light",
      "isTransparent": false,
      "locale": "en",
      "chartOnly": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "symbols": [
        ["Gold", "OANDA:XAUUSD|1D"],
        ["EUR/USD", "OANDA:EURUSD|1D"],
        ["GBP/USD", "OANDA:GBPUSD|1D"],
        ["USD/JPY", "OANDA:USDJPY|1D"]
      ],
      "dateRanges": [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ],
      "fontSize": "10",
      "headerFontSize": "medium",
      "autosize": true,
      "width": "100%",
      "height": "100%",
      "noTimeScale": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false
    });

    chartContainerRef.current.appendChild(script);

    return () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!chartCardRef.current) return;

    if (!document.fullscreenElement) {
      chartCardRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

        {/* TradingView Unified Chart */}
        <Card ref={chartCardRef} className="bg-card border-border overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-heading">Live Market Analysis</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Switch between Forex, Stocks, Commodities, Crypto & CFDs
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="border-accent/50 text-accent hover:bg-accent/10"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`tradingview-widget-container w-full ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[700px]'}`}>
              <div className="tradingview-widget-container__widget h-full" ref={chartContainerRef}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
