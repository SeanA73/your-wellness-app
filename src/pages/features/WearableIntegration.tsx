import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FitMateHeader from "@/components/FitMateHeader";
import { 
  Smartphone, 
  Watch, 
  Heart, 
  Activity,
  ArrowLeft,
  Wifi,
  Battery,
  Bluetooth,
  Zap,
  Moon,
  TrendingUp,
  Shield
} from "lucide-react";

const WearableIntegration = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: "Heart Rate Monitoring",
      description: "Real-time heart rate tracking during workouts and throughout the day"
    },
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      title: "Activity Tracking",
      description: "Automatic step counting, distance, and calorie burn tracking"
    },
    {
      icon: <Moon className="w-6 h-6 text-primary" />,
      title: "Sleep Analysis",
      description: "Comprehensive sleep tracking with quality analysis and insights"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Workout Recognition",
      description: "Automatically detect and log different types of physical activities"
    },
    {
      icon: <Bluetooth className="w-6 h-6 text-primary" />,
      title: "Seamless Sync",
      description: "Effortless data synchronization across all your connected devices"
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Data Security",
      description: "End-to-end encryption for all your health and fitness data"
    }
  ];

  const devices = [
    {
      name: "Apple Watch",
      description: "Full integration with watchOS health features",
      features: ["Heart Rate", "Workouts", "Sleep", "ECG"],
      badge: "Pro"
    },
    {
      name: "Fitbit Devices",
      description: "Complete compatibility with Fitbit ecosystem",
      features: ["Steps", "Heart Rate", "Sleep", "Stress"],
      badge: "Pro"
    },
    {
      name: "Garmin Watches",
      description: "Advanced metrics for serious athletes",
      features: ["GPS", "VO2 Max", "Training Load", "Recovery"],
      badge: "Pro"
    },
    {
      name: "Samsung Galaxy Watch",
      description: "Seamless Android integration",
      features: ["Heart Rate", "Sleep", "Stress", "Body Composition"],
      badge: "Pro"
    }
  ];

  const metrics = [
    {
      name: "Resting Heart Rate",
      description: "Track cardiovascular fitness improvements",
      icon: <Heart className="w-5 h-5 text-red-500" />
    },
    {
      name: "Daily Steps",
      description: "Monitor daily activity and movement patterns",
      icon: <Activity className="w-5 h-5 text-green-500" />
    },
    {
      name: "Sleep Quality",
      description: "Analyze sleep stages and recovery metrics",
      icon: <Moon className="w-5 h-5 text-blue-500" />
    },
    {
      name: "Workout Intensity",
      description: "Track exercise zones and effort levels",
      icon: <Zap className="w-5 h-5 text-yellow-500" />
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
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Wearable Integration</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block">Connect Your</span>
            <span className="block text-primary">Fitness Devices</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Seamlessly integrate with your favorite fitness trackers and smartwatches. 
            Get comprehensive health insights from all your devices in one unified dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              <Wifi className="w-4 h-4 mr-2" />
              Connect Devices
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/features/advanced-analytics")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Comprehensive Device Integration
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

        {/* Supported Devices */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Supported Devices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{device.name}</CardTitle>
                    <Badge variant={getBadgeVariant(device.badge)}>
                      {device.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{device.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {device.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Health Metrics */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Track Key Health Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    {metric.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{metric.name}</h3>
                  <p className="text-muted-foreground text-sm">{metric.description}</p>
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
                <Watch className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  How Wearable Integration Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1. Connect</h3>
                    <p className="text-muted-foreground">
                      Link your fitness trackers and smartwatches to FitMate Pro with secure authentication.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">2. Sync</h3>
                    <p className="text-muted-foreground">
                      Automatically sync health data from all your devices into one comprehensive dashboard.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">3. Analyze</h3>
                    <p className="text-muted-foreground">
                      Get intelligent insights and recommendations based on your complete health picture.
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
                Ready to Connect Your Devices?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Unlock the full potential of your fitness devices with intelligent integration and comprehensive analytics.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Device Integration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WearableIntegration;