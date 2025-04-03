import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import DashboardPage from "@/pages/DashboardPage";
import MarketsPage from "@/pages/MarketsPage";
import PortfolioPage from "@/pages/PortfolioPage";
import LearnPage from "@/pages/LearnPage";
import AIAdvisorPage from "@/pages/AIAdvisorPage";
import SalesforceIntegrationPage from "@/pages/SalesforceIntegrationPage";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { useAuth } from "@/hooks/use-auth";

// Route redirector component to handle authentication state
function HomeRoute() {
  const { user } = useAuth();
  
  if (user) {
    return <Redirect to="/dashboard" />;
  }
  
  return <LandingPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRoute} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/markets" component={MarketsPage} />
      <ProtectedRoute path="/portfolio" component={PortfolioPage} />
      <ProtectedRoute path="/learn" component={LearnPage} />
      <ProtectedRoute path="/advisor" component={AIAdvisorPage} />
      <ProtectedRoute path="/salesforce" component={SalesforceIntegrationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
