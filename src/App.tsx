import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";
import AdminUsers from "./pages/AdminUsers";
import Onboarding from "./pages/Onboarding";
import PremiumFeatures from "./pages/PremiumFeatures";
import Guide from "./pages/Guide";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/workout/:id" element={<WorkoutSession />} />
      <Route path="/workout/program/:programId/day/:dayId" element={<WorkoutSession />} />
      <Route path="/program/:id" element={<ProgramDetails />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/coach-picks" element={<CoachPicks />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/features/workout-planning" element={<WorkoutPlanning />} />
      <Route path="/features/nutrition-tracking" element={<NutritionTracking />} />
      <Route path="/features/mental-wellness" element={<MentalWellness />} />
      <Route path="/features/ai-coaching" element={<AICoaching />} />
      <Route path="/features/advanced-analytics" element={<AdvancedAnalytics />} />
      <Route path="/features/community-features" element={<CommunityFeatures />} />
      <Route path="/features/goal-setting" element={<GoalSetting />} />
      <Route path="/features/wearable-integration" element={<WearableIntegration />} />
      <Route path="/features/personal-coaching" element={<PersonalCoaching />} />
      <Route path="/premium" element={<PremiumFeatures />} />
      <Route path="/guide" element={<Guide />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
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
);

export default App;
