import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MessageCircle } from "lucide-react";
import heroImage from "@/assets/fitmate-hero.jpg";

const WelcomeSection = () => {
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
              <span className="text-sm font-medium">Welcome back!</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready for today's wellness journey?</h2>
            <p className="text-white/90 text-sm">Let's check in and see how you're feeling!</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Hi there! 👋</h3>
            <p className="text-sm text-muted-foreground">
              I'm FitMate, your personal wellness coach. How are you feeling today? 
              Let's start with a quick check-in to see what works best for you right now.
            </p>
          </div>
          <Button variant="wellness" size="lg" className="animate-pulse-glow">
            <MessageCircle className="w-5 h-5" />
            Chat with FitMate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;