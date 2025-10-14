import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, ArrowRight } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "Understanding Support and Resistance: The Foundation of Price Action",
      date: "May 15, 2025",
      category: "Technical Analysis",
      excerpt: "Learn how to identify key levels where price tends to reverse or consolidate. Master the art of drawing zones, not lines.",
      readTime: "8 min read",
    },
    {
      title: "The Psychology of Trading: Why Most Traders Fail",
      date: "May 12, 2025",
      category: "Trading Psychology",
      excerpt: "It's not about the strategy—it's about the mind. Discover the mental traps that destroy accounts and how to overcome them.",
      readTime: "12 min read",
    },
    {
      title: "Risk Management: The Only Edge That Matters",
      date: "May 8, 2025",
      category: "Risk Management",
      excerpt: "Position sizing, stop-loss placement, and the 1% rule. Protect your capital like the pros do.",
      readTime: "10 min read",
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Latest <span className="text-accent">Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Weekly market analysis, trading breakdowns, and educational content from our founders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                  <span className="text-accent">•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3 w-fit">
                  {post.category}
                </div>
                <CardTitle className="text-xl group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Button variant="ghost" className="text-accent hover:text-accent/80 hover:bg-accent/10 p-0">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-accent/50 text-accent hover:bg-accent/10"
          >
            View All Articles
            <TrendingUp className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
