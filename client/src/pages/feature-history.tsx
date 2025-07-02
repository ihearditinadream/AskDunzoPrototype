import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Code, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

interface FeatureRequest {
  id: string;
  websiteUrl: string;
  featureDescription: string;
  status: string;
  generatedCode?: string;
  createdAt: string;
}

export default function FeatureHistory() {
  const { data: requests, isLoading } = useQuery<FeatureRequest[]>({
    queryKey: ["/api/v1/features/history"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return "default";
      case 'processing':
        return "secondary";
      case 'failed':
        return "destructive";
      default:
        return "outline";
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Patrick Hand SC, cursive' }}>
              Feature Request History
            </h1>
            <p className="text-gray-600">
              View all your past feature requests and their status
            </p>
          </div>
          <Link href="/dashboard/request">
            <Button className="hand-drawn">
              <Code className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hand-drawn">
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="hand-drawn">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {request.websiteUrl}
                      </CardTitle>
                      <CardDescription>
                        {new Date(request.createdAt).toLocaleDateString()} at{' '}
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(request.status)} className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Feature Description:</h4>
                    <p className="text-sm text-gray-600">{request.featureDescription}</p>
                  </div>
                  
                  {request.status === 'completed' && request.generatedCode && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Generated Code:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="text-xs overflow-x-auto">
                          <code>{request.generatedCode.substring(0, 200)}...</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            navigator.clipboard.writeText(request.generatedCode!);
                          }}
                        >
                          Copy Full Code
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="hand-drawn">
            <CardContent className="py-12 text-center">
              <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Feature Requests Yet</h3>
              <p className="text-gray-600 mb-4">
                Start creating amazing features with AI-powered generation!
              </p>
              <Link href="/dashboard/request">
                <Button className="hand-drawn">
                  Create Your First Feature
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}