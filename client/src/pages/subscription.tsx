import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "wouter";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const isPremium = user?.subscriptionTier === 'premium';
  const hasStripeSubscription = !!user?.stripeSubscriptionId;

  const createCheckoutMutation = useMutation({
    mutationFn: (plan: string) => 
      apiRequest("POST", "/api/v1/subscriptions/create-checkout-session", { plan }).then(res => res.json()),
    onSuccess: (data) => {
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        toast({
          title: "Error",
          description: "Failed to create checkout session - no URL returned",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => 
      apiRequest("POST", "/api/v1/subscriptions/cancel").then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = () => {
    setIsProcessing(true);
    createCheckoutMutation.mutate('premium');
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period.")) {
      cancelSubscriptionMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-white grid-bg">
      <header className="border-b border-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <img src={logoBlack} alt="AskDunzo" className="h-10" />
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Patrick Hand SC, cursive' }}>
          Subscription Management
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your AskDunzo subscription and billing
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Plan */}
          <Card className="hand-drawn">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {isPremium ? 'Premium' : 'Free'}
                </span>
                <Badge className={isPremium ? "bg-black text-white" : "bg-gray-200 text-gray-700"}>
                  {isPremium ? 'Active' : 'Basic'}
                </Badge>
              </div>
              
              {isPremium && user?.subscriptionExpiresAt && (
                <p className="text-sm text-gray-600">
                  Next billing date: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                </p>
              )}

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-sm">
                  {isPremium ? 'Premium Features:' : 'Free Features:'}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {isPremium ? (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Unlimited AI-powered feature requests
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Priority feature generation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Access to WebSquare marketplace
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Data sharing rewards program
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Basic browser extension
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400" />
                        Limited to manual features only
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400" />
                        No AI-powered generation
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade/Manage */}
          <Card className="hand-drawn">
            <CardHeader>
              <CardTitle>
                {isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
              </CardTitle>
              <CardDescription>
                {isPremium 
                  ? 'Manage your billing and subscription settings'
                  : 'Unlock all features with Premium'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isPremium && (
                <>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold">$10</p>
                    <p className="text-gray-600">per month</p>
                  </div>

                  <Button 
                    className="w-full hand-drawn"
                    size="lg"
                    onClick={handleSubscribe}
                    disabled={isProcessing || createCheckoutMutation.isPending}
                  >
                    {isProcessing || createCheckoutMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </>
                    )}
                  </Button>
                </>
              )}

              {isPremium && hasStripeSubscription && (
                <>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      You're currently on the Premium plan at $10/month.
                    </p>
                    
                    <Button
                      variant="outline"
                      className="w-full hand-drawn"
                      onClick={handleCancel}
                      disabled={cancelSubscriptionMutation.isPending}
                    >
                      {cancelSubscriptionMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      You'll retain access until the end of your billing period.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="hand-drawn mt-6">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">What's included in Premium?</h4>
              <p className="text-sm text-gray-600">
                Premium includes unlimited AI-powered feature requests, priority generation, 
                access to the WebSquare marketplace, and eligibility for the data sharing rewards program.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">Can I cancel anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes! You can cancel your subscription at any time. You'll retain access to Premium 
                features until the end of your current billing period.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">How does billing work?</h4>
              <p className="text-sm text-gray-600">
                We use Stripe for secure payment processing. You'll be charged $10 monthly, 
                and your subscription will automatically renew unless cancelled.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}