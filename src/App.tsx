import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PremiumRoute } from "@/components/PremiumRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Workouts from "./pages/Workouts";
import WorkoutSession from "./pages/WorkoutSession";
import ProgramDetails from "./pages/ProgramDetails";
import Nutrition from "./pages/Nutrition";
import Chat from "./pages/Chat";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import CoachPicks from "./pages/CoachPicks";
import WorkoutPlanning from "./pages/features/WorkoutPlanning";
import NutritionTracking from "./pages/features/NutritionTracking";
import MentalWellness from "./pages/features/MentalWellness";
import AICoaching from "./pages/features/AICoaching";
import AdvancedAnalytics from "./pages/features/AdvancedAnalytics";
import CommunityFeatures from "./pages/features/CommunityFeatures";
import GoalSetting from "./pages/features/GoalSetting";
import WearableIntegration from "./pages/features/WearableIntegration";
import PersonalCoaching from "./pages/features/PersonalCoaching";
import Onboarding from "./pages/Onboarding";
import PremiumFeatures from "./pages/PremiumFeatures";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import Recommendations from "./pages/Recommendations";
import Guide from "./pages/Guide";
// AdminDashboard and AdminUsers are intentionally NOT imported. Both pages
// remain on disk but are unreachable — see the routes below. AdminSetup was
// deleted outright: it granted premium and self-assigned the admin role from
// the browser.

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      <Route path="/guide" element={<Guide />} />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/workouts" 
        element={
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/workout/:id" 
        element={
          <ProtectedRoute>
            <WorkoutSession />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/workout/program/:programId/day/:dayId" 
        element={
          <ProtectedRoute>
            <WorkoutSession />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/program/:id" 
        element={
          <ProtectedRoute>
            <ProgramDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/nutrition" 
        element={
          <ProtectedRoute>
            <Nutrition />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/shop" 
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coach-picks"
        element={
          <ProtectedRoute>
            <CoachPicks />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/workout-planning" 
        element={
          <ProtectedRoute>
            <WorkoutPlanning />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/nutrition-tracking" 
        element={
          <ProtectedRoute>
            <NutritionTracking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/mental-wellness" 
        element={
          <ProtectedRoute>
            <MentalWellness />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/ai-coaching" 
        element={
          <ProtectedRoute>
            <AICoaching />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/advanced-analytics" 
        element={
          <PremiumRoute>
            <AdvancedAnalytics />
          </PremiumRoute>
        } 
      />
      <Route 
        path="/features/community-features" 
        element={
          <ProtectedRoute>
            <CommunityFeatures />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/features/goal-setting" 
        element={
          <PremiumRoute>
            <GoalSetting />
          </PremiumRoute>
        } 
      />
      <Route 
        path="/features/wearable-integration" 
        element={
          <PremiumRoute>
            <WearableIntegration />
          </PremiumRoute>
        } 
      />
      <Route 
        path="/features/personal-coaching" 
        element={
          <PremiumRoute>
            <PersonalCoaching />
          </PremiumRoute>
        } 
      />
      <Route 
        path="/premium" 
        element={
          <ProtectedRoute>
            <PremiumFeatures />
          </ProtectedRoute>
        } 
      />
      {/* /admin, /admin/users and /admin-setup are deliberately NOT routed.
          The admin RLS policies these pages need are not in the applied schema —
          profiles, subscriptions, revenue_events and usage_tracking are all
          self-row-only, so the dashboard could only ever show the admin's own
          row. /admin-setup additionally granted premium from the browser. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
