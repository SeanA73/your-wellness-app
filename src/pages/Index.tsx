import FitMateHeader from "@/components/FitMateHeader";
import WelcomeSection from "@/components/WelcomeSection";
import DailyCheckIn from "@/components/DailyCheckIn";
import WorkoutPlanning from "@/components/WorkoutPlanning";
import NutritionTracking from "@/components/NutritionTracking";
import ProgressVisualization from "@/components/ProgressVisualization";
import MentalWellness from "@/components/MentalWellness";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FitMateHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
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
        </div>
      </main>
    </div>
  );
};

export default Index;
