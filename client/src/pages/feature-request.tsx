import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

const featureRequestSchema = z.object({
  websiteUrl: z.string().url("Please enter a valid URL"),
  featureDescription: z.string().min(20, "Please provide a detailed description (at least 20 characters)"),
  targetElement: z.string().optional(),
});

type FeatureRequestForm = z.infer<typeof featureRequestSchema>;

export default function FeatureRequest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [generatedCode, setGeneratedCode] = useState("");

  const form = useForm<FeatureRequestForm>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      websiteUrl: "",
      featureDescription: "",
      targetElement: "",
    },
  });

  const createFeatureMutation = useMutation({
    mutationFn: (data: FeatureRequestForm) => 
      apiRequest("POST", "/api/v1/features/request", data).then(res => res.json()),
    onSuccess: (data) => {
      if (data.generatedCode) {
        setGeneratedCode(data.generatedCode);
        toast({
          title: "Feature Generated!",
          description: "Your custom feature code has been generated successfully.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/v1/features/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FeatureRequestForm) => {
    createFeatureMutation.mutate(data);
  };

  const isPremium = user?.subscriptionTier === 'premium';

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-white grid-bg">
        <header className="border-b border-black">
          <div className="container mx-auto px-6 py-4">
            <Link href="/dashboard">
              <img src={logoBlack} alt="AskDunzo" className="h-10" />
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8 max-w-2xl">
          <Card className="hand-drawn">
            <CardHeader>
              <CardTitle>Premium Feature Required</CardTitle>
              <CardDescription>
                Upgrade to Premium to unlock AI-powered feature generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Feature requests are available exclusively for Premium subscribers.</p>
              <Link href="/dashboard/subscription">
                <Button className="hand-drawn w-full">
                  Upgrade to Premium - $10/month
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Patrick Hand SC, cursive' }}>
          Create a Feature Request
        </h1>
        <p className="text-gray-600 mb-8">
          Describe the feature you want, and our AI will generate the code for you!
        </p>

        {!generatedCode ? (
          <Card className="hand-drawn">
            <CardHeader>
              <CardTitle>Feature Details</CardTitle>
              <CardDescription>
                Be as specific as possible to get the best results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            className="hand-drawn"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The website where you want to add the feature
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featureDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a dark mode toggle button that switches between light and dark themes..."
                            className="hand-drawn min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what you want the feature to do
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetElement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Element (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., header, .navbar, #menu" 
                            className="hand-drawn"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Specific area where the feature should be added
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full hand-drawn" 
                    size="lg"
                    disabled={createFeatureMutation.isPending}
                  >
                    {createFeatureMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Feature
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="hand-drawn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Feature Generated Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Generated Code:</h3>
                <pre className="bg-black text-white p-4 rounded overflow-x-auto">
                  <code>{generatedCode}</code>
                </pre>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  To use this feature:
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Copy the generated code</li>
                  <li>Install the AskDunzo browser extension</li>
                  <li>Paste the code when prompted on your target website</li>
                </ol>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="hand-drawn flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    toast({
                      title: "Copied!",
                      description: "Code copied to clipboard",
                    });
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="hand-drawn flex-1"
                  onClick={() => {
                    setGeneratedCode("");
                    form.reset();
                  }}
                >
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}