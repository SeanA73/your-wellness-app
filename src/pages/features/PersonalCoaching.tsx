import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FitMateHeader from "@/components/FitMateHeader";
import { 
  User, 
  Video, 
  Calendar, 
  MessageCircle,
  ArrowLeft,
  Star,
  Award,
  CheckCircle,
  Zap,
  Clock,
  Users,
  Target
} from "lucide-react";

const PersonalCoaching = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <User className="w-6 h-6 text-primary" />,
      title: "Certified Trainers",
      description: "Work with experienced, certified fitness professionals"
    },
    {
      icon: <Video className="w-6 h-6 text-primary" />,
      title: "Virtual Sessions",
      description: "One-on-one coaching sessions via high-quality video calls"
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule with easy rescheduling options"
    },
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Custom Programs",
      description: "Personalized workout and nutrition plans tailored to your goals"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
      title: "24/7 Support",
      description: "Direct messaging with your coach between scheduled sessions"
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Progress Reviews",
      description: "Regular assessments and plan adjustments based on your progress"
    }
  ];

  const coaches = [
    {
      name: "Sarah Johnson",
      specialization: "Weight Loss & Strength Training",
      experience: "8+ years",
      rating: 4.9,
      badge: "Pro"
    },
    {
      name: "Mike Rodriguez",
      specialization: "Sports Performance & Athletic Training",
      experience: "12+ years",
      rating: 4.8,
      badge: "Pro"
    },
    {
      name: "Emily Chen",
      specialization: "Yoga & Mindfulness Coaching",
      experience: "6+ years",
      rating: 5.0,
      badge: "Pro"
    },
    {
      name: "David Thompson",
      specialization: "Bodybuilding & Nutrition",
      experience: "10+ years",
      rating: 4.9,
      badge: "Pro"
    }
  ];

  const packages = [
    {
      name: "Starter Package",
      sessions: "2 sessions/month",
      duration: "45 minutes each",
      price: "$149/month",
      features: ["Personal trainer", "Custom workout plan", "Progress tracking"]
    },
    {
      name: "Premium Package",
      sessions: "4 sessions/month",
      duration: "45 minutes each",
      price: "$249/month",
      features: ["Personal trainer", "Custom plans", "24/7 chat support", "Nutrition guidance"]
    },
    {
      name: "Elite Package",
      sessions: "8 sessions/month",
      duration: "60 minutes each",
      price: "$399/month",
      features: ["Dedicated trainer", "Comprehensive plans", "Daily check-ins", "Meal planning"]
    }
  ];

  const testimonials = [
    {
      name: "Rachel M.",
      achievement: "Lost 35 lbs in 6 months",
      text: "My coach helped me completely transform my relationship with fitness. The personalized approach made all the difference.",
      rating: 5
    },
    {
      name: "James L.",
      achievement: "Increased bench press by 60 lbs",
      text: "Having a professional guide my training has taken my strength to levels I never thought possible.",
      rating: 5
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
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">1-on-1 Personal Coaching</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block">Expert Guidance</span>
            <span className="block text-primary">Personalized for You</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Work directly with certified fitness professionals who provide personalized training, 
            nutrition guidance, and ongoing support to help you achieve your goals faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              <User className="w-4 h-4 mr-2" />
              Find Your Coach
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/features/ai-coaching")}>
              <Zap className="w-4 h-4 mr-2" />
              Try AI Coaching
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Professional Coaching Experience
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

        {/* Meet Our Coaches */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Meet Our Expert Coaches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coaches.map((coach, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{coach.name}</CardTitle>
                    <Badge variant={getBadgeVariant(coach.badge)}>
                      {coach.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(coach.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">{coach.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">• {coach.experience}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{coach.specialization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coaching Packages */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Choose Your Coaching Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.sessions} • {pkg.duration}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-primary">{testimonial.achievement}</p>
                  </div>
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
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  How Personal Coaching Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1. Match & Meet</h3>
                    <p className="text-muted-foreground">
                      Get matched with a certified coach based on your goals and preferences, then have an initial consultation.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">2. Plan & Train</h3>
                    <p className="text-muted-foreground">
                      Receive personalized workout and nutrition plans, then train together in scheduled virtual sessions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">3. Progress & Adapt</h3>
                    <p className="text-muted-foreground">
                      Track your progress with regular check-ins and plan adjustments to ensure continued improvement.
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
                Ready for Personal Coaching?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Take your fitness to the next level with expert guidance and personalized support from certified professionals.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Personal Coaching
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalCoaching;