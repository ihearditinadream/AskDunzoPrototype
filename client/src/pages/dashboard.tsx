import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Code, History, Settings, CreditCard, Share2 } from "lucide-react";
import { Link } from "wouter";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("request");

  const isPremium = user?.subscriptionTier === 'premium';

  return (
    <div className="min-h-screen bg-white grid-bg">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src={logoBlack} alt="AskDunzo" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              {isPremium && (
                <Badge className="bg-black text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Button 
                variant="outline" 
                className="hand-drawn"
                onClick={() => window.location.href = "/api/logout"}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Patrick Hand SC, cursive' }}>
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-gray-600 mb-8">
            {isPremium 
              ? "Ready to create some amazing features? Let's make the web yours!"
              : "Upgrade to Premium to unlock AI-powered feature generation!"}
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full hand-drawn">
              <TabsTrigger value="request" className="gap-2">
                <Code className="w-4 h-4" />
                Request
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="websquare" className="gap-2">
                <Sparkles className="w-4 h-4" />
                WebSquare
              </TabsTrigger>
              <TabsTrigger value="subscription" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="data-sharing" className="gap-2">
                <Share2 className="w-4 h-4" />
                Data Sharing
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Request Tab */}
            <TabsContent value="request">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle>Request a New Feature</CardTitle>
                  <CardDescription>
                    {isPremium 
                      ? "Describe any feature you want, and our AI will generate the code for you!"
                      : "Upgrade to Premium to unlock AI-powered feature generation"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPremium ? (
                    <Link href="/dashboard/request">
                      <Button className="w-full hand-drawn" size="lg">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create New Feature Request
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-gray-600">
                        Premium users can request unlimited features with AI-powered code generation.
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
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle>Feature Request History</CardTitle>
                  <CardDescription>
                    View all your past feature requests and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/history">
                    <Button variant="outline" className="w-full hand-drawn">
                      View Full History
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WebSquare Tab */}
            <TabsContent value="websquare">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle>WebSquare Marketplace</CardTitle>
                  <CardDescription>
                    Browse and install community-created features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/websquare">
                    <Button className="w-full hand-drawn" size="lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Browse WebSquare
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/subscription">
                    <Button variant="outline" className="w-full hand-drawn">
                      Manage Subscription
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Sharing Tab */}
            <TabsContent value="data-sharing">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle>Data Sharing Program</CardTitle>
                  <CardDescription>
                    Help improve AskDunzo and earn rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/data-sharing">
                    <Button variant="outline" className="w-full hand-drawn">
                      Manage Data Sharing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="w-full hand-drawn">
                      Go to Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}