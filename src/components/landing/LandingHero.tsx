import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, MessageCircle, Target } from "lucide-react";
import heroImage from "@/assets/fitmate-hero.jpg";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="People exercising and staying healthy together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
          <Heart className="w-5 h-5 text-accent" />
          <span className="font-medium">Your Personal Wellness Coach</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
          <span className="block">Transform Your</span>
          <span className="block bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            Fitness Journey
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
          Meet FitMate Pro - Your AI-powered companion for workouts, nutrition, and mental wellness. 
          Get personalized guidance, track your progress, and build lasting healthy habits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto"
            onClick={() => navigate("/auth")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Journey Free
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
            onClick={() => {
              const featuresSection = document.getElementById('features');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Target className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            🏋️ Personalized Workouts
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            🥗 Smart Nutrition Tracking
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            🧠 Mental Wellness Support
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            📊 Progress Analytics
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float hidden lg:block">
        <div className="w-16 h-16 bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-20 right-10 animate-float-delayed hidden lg:block">
        <div className="w-20 h-20 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-secondary" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;