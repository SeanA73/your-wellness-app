import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MessageCircle, ArrowRight, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/fitmate-hero.jpg";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  
  useEffect(() => {
    // Check if user just completed onboarding
    const justCompleted = sessionStorage.getItem('onboarding_just_completed');
    if (justCompleted === 'true') {
      setIsNewUser(true);
      sessionStorage.removeItem('onboarding_just_completed');
    }
  }, []);
  
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-smooth">
      <div className="relative">
        <img 
          src={heroImage} 
          alt="People exercising and staying healthy together"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-wellness-gradient/80 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isNewUser ? "Welcome to FitMatePro!" : "Welcome back!"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
              {isNewUser 
                ? "Let's start your fitness journey!" 
                : "Ready for today's wellness journey?"}
            </h2>
            <p className="text-white/90 text-sm">
              {isNewUser 
                ? "Your personalized dashboard is ready. Let's explore!" 
                : "Let's check in and see how you're feeling!"}
            </p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        {isNewUser ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">🎉 You're all set!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                I'm FitMatePro, your personal wellness coach. Based on your preferences, here's how to get started:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate("/workouts")}
              >
                <Target className="w-4 h-4 mr-2" />
                Browse Workouts
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Coach
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Hi {profile?.full_name?.split(' ')[0] || 'there'}! 👋</h3>
              <p className="text-sm text-muted-foreground">
                I'm FitMatePro, your personal wellness coach. How are you feeling today? 
                Let's start with a quick check-in to see what works best for you right now.
              </p>
            </div>
            <Button variant="wellness" size="lg" className="animate-pulse-glow" onClick={() => navigate("/chat")}>
              <MessageCircle className="w-5 h-5" />
              Chat with FitMatePro
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;