import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FitMateHeader from "@/components/FitMateHeader";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  ArrowLeft,
  Eye,
  Activity,
  LineChart,
  PieChart,
  Zap,
  Trophy
} from "lucide-react";

const AdvancedAnalytics = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: "Progress Charts",
      description: "Visual representations of your fitness journey with detailed charts and graphs"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Performance Trends",
      description: "Track your improvement over time with intelligent trend analysis"
    },
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Goal Analytics",
      description: "Detailed insights into your goal achievement rates and patterns"
    },
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      title: "Workout Metrics",
      description: "Comprehensive analysis of your workout intensity, duration, and frequency"
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: "Body Composition",
      description: "Track changes in weight, muscle mass, and body fat percentage"
    },
    {
      icon: <PieChart className="w-6 h-6 text-primary" />,
      title: "Nutrition Breakdown",
      description: "Detailed macro and micronutrient analysis with visual breakdowns"
    }
  ];

  const analyticsTypes = [
    {
      name: "Strength Progression",
      description: "Track your strength gains across all exercises",
      badge: "Premium"
    },
    {
      name: "Cardiovascular Health",
      description: "Monitor heart rate zones and endurance improvements",
      badge: "Premium"
    },
    {
      name: "Recovery Analysis",
      description: "Analyze sleep patterns and recovery metrics",
      badge: "Premium"
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Premium": return "default";
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
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Advanced Analytics</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block">Data-Driven</span>
            <span className="block text-primary">Fitness Insights</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform raw data into actionable insights. Our advanced analytics provide deep understanding 
            of your fitness journey with predictive modeling and personalized recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              <Zap className="w-4 h-4 mr-2" />
              Start Analytics
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/features/ai-coaching")}>
              <Eye className="w-4 h-4 mr-2" />
              View AI Coaching
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Powerful Analytics Tools
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

        {/* Analytics Types */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Comprehensive Analytics Suite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{type.name}</CardTitle>
                    <Badge variant={getBadgeVariant(type.badge)}>
                      {type.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Analytics Matter */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Why Advanced Analytics Matter
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Make Informed Decisions</h3>
                    <p className="text-muted-foreground">
                      Use data-driven insights to optimize your training and nutrition strategies for better results.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                    <p className="text-muted-foreground">
                      See exactly how far you've come with detailed progress tracking and milestone analysis.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Predict Success</h3>
                    <p className="text-muted-foreground">
                      Our AI algorithms help predict when you'll reach your goals and suggest optimizations.
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
                Ready to Unlock Your Data?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Get detailed insights into your fitness journey and discover new ways to optimize your performance.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Your Analytics Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;