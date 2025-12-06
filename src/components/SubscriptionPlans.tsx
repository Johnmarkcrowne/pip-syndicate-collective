import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionPlansProps {
  userEmail?: string;
}

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 29,
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Access to all live classes",
      "Community access",
      "Recording library",
      "Cancel anytime",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 249,
    period: "/year",
    description: "Best value - Save $99",
    popular: true,
    features: [
      "Everything in Monthly",
      "2 months free",
      "Priority support",
      "Exclusive resources",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 499,
    period: "one-time",
    description: "Pay once, learn forever",
    features: [
      "Everything in Yearly",
      "Lifetime access",
      "All future content",
      "VIP community status",
    ],
  },
];

export function SubscriptionPlans({ userEmail }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: userEmail || "",
    phone: "",
  });

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("pesapal-create-order", {
        body: {
          subscriptionType: selectedPlan,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Payment failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Enter your details to proceed with payment via Pesapal
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${plans.find(p => p.id === selectedPlan)?.price || 0}`
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
