import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  BarChart3, 
  MessageCircle, 
  Users, 
  Target, 
  Zap,
  Heart,
  Calendar,
  Trophy,
  Smartphone
} from "lucide-react";

const FeaturesSection = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Dumbbell className="w-8 h-8 text-primary" />,
      title: "Smart Workout Planning",
      description: "AI-generated workout plans tailored to your fitness level, goals, and available equipment.",
      badge: "Free",
      highlights: ["Custom routines", "Exercise library", "Video guides"]
    },
    {
      icon: <Apple className="w-8 h-8 text-primary" />,
      title: "Nutrition Tracking",
      description: "Log meals, track macros, and get personalized nutrition advice from your AI coach.",
      badge: "Free",
      highlights: ["Meal logging", "Macro tracking", "Recipe suggestions"]
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "Mental Wellness",
      description: "Daily check-ins, mood tracking, and mindfulness exercises for holistic health.",
      badge: "Free",
      highlights: ["Mood tracking", "Stress management", "Wellness insights"]
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-accent" />,
      title: "AI Personal Coach",
      description: "Chat with FitMate Pro anytime for instant fitness advice, motivation, and support.",
      badge: "Premium",
      highlights: ["24/7 availability", "Personalized tips", "Progress insights"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-accent" />,
      title: "Advanced Analytics",
      description: "Detailed progress tracking with visual charts and predictive insights.",
      badge: "Premium",
      highlights: ["Progress charts", "Goal tracking", "Performance metrics"]
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Community Features",
      description: "Join group workouts, share achievements, and connect with like-minded people.",
      badge: "Premium",
      highlights: ["Group classes", "Social sharing", "Challenges"]
    },
    {
      icon: <Target className="w-8 h-8 text-secondary" />,
      title: "Goal Setting & Tracking",
      description: "Set SMART goals and track your progress with intelligent milestone suggestions.",
      badge: "Pro",
      highlights: ["SMART goals", "Milestone tracking", "Achievement system"]
    },
    {
      icon: <Smartphone className="w-8 h-8 text-secondary" />,
      title: "Wearable Integration",
      description: "Sync with fitness trackers and smartwatches for comprehensive health monitoring.",
      badge: "Pro",
      highlights: ["Device sync", "Heart rate monitoring", "Sleep tracking"]
    },
    {
      icon: <Trophy className="w-8 h-8 text-secondary" />,
      title: "1-on-1 Coaching",
      description: "Monthly virtual coaching sessions with certified fitness professionals.",
      badge: "Pro",
      highlights: ["Personal trainer", "Custom plans", "Expert guidance"]
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Free": return "secondary";
      case "Premium": return "default";
      case "Pro": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="block">Everything You Need for</span>
            <span className="block text-primary">Complete Wellness</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From personalized workouts to AI coaching, FitMate Pro provides comprehensive tools 
            to support your fitness journey at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const getFeatureRoute = (index: number) => {
              const routes = [
                '/features/workout-planning',
                '/features/nutrition-tracking', 
                '/features/mental-wellness',
                '/features/ai-coaching',
                '/auth', // Analytics - redirect to auth for now
                '/auth', // Community - redirect to auth for now
                '/auth', // Goal Setting - redirect to auth for now
                '/auth', // Wearable Integration - redirect to auth for now
                '/auth'  // 1-on-1 Coaching - redirect to auth for now
              ];
              return routes[index] || '/auth';
            };

            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted cursor-pointer"
                onClick={() => navigate(getFeatureRoute(index))}
              >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <Badge variant={getBadgeVariant(feature.badge)}>
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Heart className="w-3 h-3 text-accent" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Transformation?
            </h3>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their lives with FitMate Pro. 
              Start your free trial today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-primary hover:bg-white/90 transition-colors px-8 py-4 rounded-full font-semibold text-lg"
                onClick={() => navigate("/auth?trial=true&plan=premium")}
              >
                Start Free Trial
              </button>
              <button 
                className="border-2 border-white/30 text-white hover:bg-white/10 transition-colors px-8 py-4 rounded-full font-semibold text-lg"
                onClick={() => {
                  const pricingSection = document.querySelector('[data-section="pricing"]');
                  pricingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;