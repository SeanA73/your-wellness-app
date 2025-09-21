import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Workouts from "./pages/Workouts";
import WorkoutSession from "./pages/WorkoutSession";
import Nutrition from "./pages/Nutrition";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import WorkoutPlanning from "./pages/features/WorkoutPlanning";
import NutritionTracking from "./pages/features/NutritionTracking";
import MentalWellness from "./pages/features/MentalWellness";
import AICoaching from "./pages/features/AICoaching";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/workout/:id" element={<WorkoutSession />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/features/workout-planning" element={<WorkoutPlanning />} />
      <Route path="/features/nutrition-tracking" element={<NutritionTracking />} />
      <Route path="/features/mental-wellness" element={<MentalWellness />} />
      <Route path="/features/ai-coaching" element={<AICoaching />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
