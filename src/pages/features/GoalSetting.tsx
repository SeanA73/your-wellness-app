import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FitMateHeader from "@/components/FitMateHeader";
import { 
  Target, 
  Trophy, 
  Calendar, 
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  Flag,
  Award,
  Zap,
  Clock,
  BarChart3
} from "lucide-react";

const GoalSetting = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "SMART Goals",
      description: "Create Specific, Measurable, Achievable, Relevant, and Time-bound fitness goals"
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Milestone Tracking",
      description: "Break down large goals into smaller, manageable milestones with deadlines"
    },
    {
      icon: <Trophy className="w-6 h-6 text-primary" />,
      title: "Achievement System",
      description: "Earn badges and rewards as you complete goals and reach new milestones"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Progress Analytics",
      description: "Visualize your progress with detailed charts and performance metrics"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      title: "Goal Templates",
      description: "Choose from pre-built goal templates or create completely custom objectives"
    },
    {
      icon: <Flag className="w-6 h-6 text-primary" />,
      title: "Adaptive Planning",
      description: "Goals automatically adjust based on your progress and performance data"
    }
  ];

  const goalTypes = [
    {
      name: "Weight Management",
      description: "Lose, gain, or maintain weight with structured plans",
      timeframe: "3-6 months",
      badge: "Pro"
    },
    {
      name: "Strength Building",
      description: "Progressive strength training with measurable targets",
      timeframe: "6-12 months",
      badge: "Pro"
    },
    {
      name: "Endurance Goals",
      description: "Build cardiovascular fitness and stamina",
      timeframe: "2-4 months",
      badge: "Pro"
    },
    {
      name: "Body Composition",
      description: "Achieve ideal muscle-to-fat ratio",
      timeframe: "6-9 months",
      badge: "Pro"
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Pro": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FitMateHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Goal Setting & Tracking</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block">Turn Dreams Into</span>
            <span className="block text-primary">Achievable Goals</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Set meaningful fitness goals, track your progress with precision, and celebrate every milestone. 
            Our intelligent goal-setting system adapts to your journey and keeps you motivated.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              <Flag className="w-4 h-4 mr-2" />
              Set Your Goals
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/features/advanced-analytics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Smart Goal Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Goal Types */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Popular Goal Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goalTypes.map((goal, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{goal.name}</CardTitle>
                    <Badge variant={getBadgeVariant(goal.badge)}>
                      {goal.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{goal.timeframe}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <Award className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  How Goal Setting Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1. Define & Plan</h3>
                    <p className="text-muted-foreground">
                      Set clear, specific goals using our SMART framework and get a personalized action plan.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">2. Track Progress</h3>
                    <p className="text-muted-foreground">
                      Monitor your daily actions and see real-time progress toward your milestones.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">3. Achieve & Celebrate</h3>
                    <p className="text-muted-foreground">
                      Reach your goals, earn achievements, and set new challenges to continue growing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Achieve Your Goals?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Start setting meaningful fitness goals today and watch as you transform your aspirations into achievements.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Goal Setting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalSetting;