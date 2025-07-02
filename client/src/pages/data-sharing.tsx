import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Share2, Heart, DollarSign, Info } from "lucide-react";
import { Link } from "wouter";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function DataSharing() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isOptedIn, setIsOptedIn] = useState(user?.dataSharingOptIn || false);
  const [profitSplit, setProfitSplit] = useState(user?.dataSharingProfitSplit || 50);

  const updateDataSharingMutation = useMutation({
    mutationFn: (data: { optIn: boolean; profitSplit: number }) => 
      apiRequest("POST", "/api/v1/data-sharing/opt-in", data).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your data sharing preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateDataSharingMutation.mutate({
      optIn: isOptedIn,
      profitSplit: profitSplit,
    });
  };

  const isPremium = user?.subscriptionTier === 'premium';

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
          Data Sharing Program
        </h1>
        <p className="text-gray-600 mb-8">
          Help improve AskDunzo and choose how to handle any revenue generated
        </p>

        {/* Program Overview */}
        <Card className="hand-drawn mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              When you opt into our data sharing program, your feature requests and usage patterns 
              help us improve AskDunzo's AI capabilities. If your data contributes to features that 
              generate revenue, you can choose how to handle your share of the profits.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Help improve AI feature generation for everyone</li>
                <li>Contribute to the development of better features</li>
                <li>Potentially earn revenue or support development</li>
                <li>Be part of the AskDunzo community innovation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="hand-drawn">
          <CardHeader>
            <CardTitle>Your Settings</CardTitle>
            <CardDescription>
              {isPremium 
                ? "Configure your data sharing preferences"
                : "Premium subscription required to participate"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPremium ? (
              <>
                {/* Opt-in Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="data-sharing" className="text-base font-semibold">
                      Participate in Data Sharing
                    </Label>
                    <p className="text-sm text-gray-600">
                      Share your usage data to help improve AskDunzo
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={isOptedIn}
                    onCheckedChange={setIsOptedIn}
                  />
                </div>

                {/* Profit Split Options */}
                {isOptedIn && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      Revenue Distribution Preference
                    </Label>
                    <RadioGroup 
                      value={profitSplit.toString()} 
                      onValueChange={(value) => setProfitSplit(parseInt(value))}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="50" id="split" />
                          <Label htmlFor="split" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">50/50 Split</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Keep 50% of any revenue generated from your data contributions
                            </p>
                          </Label>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="0" id="donate" />
                          <Label htmlFor="donate" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="font-semibold">100% to Development</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Donate your entire share to support AskDunzo's development
                            </p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Current Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Current Status:</span>
                  <Badge className={isOptedIn ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {isOptedIn ? (
                      <>
                        <Share2 className="w-3 h-3 mr-1" />
                        Sharing Active
                      </>
                    ) : (
                      'Not Participating'
                    )}
                  </Badge>
                </div>

                {/* Save Button */}
                <Button 
                  className="w-full hand-drawn" 
                  onClick={handleSave}
                  disabled={updateDataSharingMutation.isPending}
                >
                  {updateDataSharingMutation.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Share2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-gray-600 mb-4">
                  The data sharing program is available exclusively for Premium subscribers.
                </p>
                <Link href="/dashboard/subscription">
                  <Button className="hand-drawn">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="hand-drawn mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Your data is anonymized and encrypted. We never share personal information. 
              You can opt out at any time, and we'll stop using your data for future improvements. 
              For more details, please review our Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}