import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import FitMateHeader from "@/components/FitMateHeader";
import WelcomeSection from "@/components/WelcomeSection";
import DailyCheckIn from "@/components/DailyCheckIn";
import WorkoutPlanning from "@/components/WorkoutPlanning";
import NutritionTracking from "@/components/NutritionTracking";
import ProgressVisualization from "@/components/ProgressVisualization";
import MentalWellness from "@/components/MentalWellness";
import LandingHero from "@/components/landing/LandingHero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/subscription/PricingSection";
import { PersonalizedRecommendations } from "@/components/shop/PersonalizedRecommendations";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check if user needs onboarding (check both localStorage and database)
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user || loading) {
        setCheckingOnboarding(false);
        return;
      }

      // First check localStorage for quick check
      const localOnboarding = localStorage.getItem('onboarding_complete');
      if (localOnboarding) {
        setCheckingOnboarding(false);
        return;
      }

      // Check database for onboarding status
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('notification_settings')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        // notification_settings is jsonb (typed Json), so narrow before reading the key
        const settings = (data?.notification_settings ?? null) as { onboarding_complete?: boolean } | null;
        const onboardingComplete = settings?.onboarding_complete;
        if (onboardingComplete) {
          localStorage.setItem('onboarding_complete', 'true');
          setCheckingOnboarding(false);
        } else {
          navigate("/onboarding");
        }
      } catch (error) {
        // If check fails, use localStorage as fallback
        const localCheck = localStorage.getItem('onboarding_complete');
        if (!localCheck) {
          navigate("/onboarding");
        }
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user, loading, navigate]);

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <FitMateHeader />
        <main className="flex-1">
          <LandingHero />
          <FeaturesSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    );
  }

  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FitMateHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1">
        <div className="space-y-8">
          {/* Welcome Section */}
          <WelcomeSection />
          
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <WorkoutPlanning />
              <NutritionTracking />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <DailyCheckIn />
              <MentalWellness />
            </div>
          </div>
          
          {/* Progress Section */}
          <ProgressVisualization />
          
          {/* Personalised product recommendations */}
          <PersonalizedRecommendations
            title="Recommended for You"
            limit={4}
            context="general"
            autoGenerate={true}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
