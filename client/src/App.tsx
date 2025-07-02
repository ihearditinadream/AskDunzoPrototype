import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import FeatureRequest from "@/pages/feature-request";
import FeatureHistory from "@/pages/feature-history";
import DataSharing from "@/pages/data-sharing";
import Subscription from "@/pages/subscription";
import ExtensionInstall from "@/pages/extension-install";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboard/request" component={FeatureRequest} />
          <Route path="/dashboard/history" component={FeatureHistory} />
          <Route path="/dashboard/data-sharing" component={DataSharing} />
          <Route path="/dashboard/subscription" component={Subscription} />
          <Route path="/home" component={Home} />
          <Route path="/install-extension" component={ExtensionInstall} />
        </>
      )}
      <Route path="/install-extension" component={ExtensionInstall} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
