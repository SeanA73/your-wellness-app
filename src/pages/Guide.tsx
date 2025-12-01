import FitMateHeader from "@/components/FitMateHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Apple, 
  MessageSquare, 
  TrendingUp, 
  Crown, 
  ShoppingBag,
  Heart,
  Target,
  Calendar,
  CheckCircle2,
  Zap,
  Users,
  Download,
  Palette,
  ChefHat
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Guide = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Workout Planning",
      badge: "Free & Premium",
      description: "Track workouts and create custom plans",
      details: [
        "Browse pre-built workout programs for different fitness goals",
        "Free users: 3 workouts per week",
        "Premium users: Unlimited workout tracking",
        "Create custom workout plans with exercise builder",
        "Track sets, reps, and weights for each exercise",
        "Monitor workout history and progress over time"
      ]
    },
    {
      icon: Apple,
      title: "Nutrition Tracking",
      badge: "Free & Premium",
      description: "Log meals and track your nutrition",
      details: [
        "Simple meal logging for free users",
        "Search extensive food database",
        "Track calories and macros (protein, carbs, fat)",
        "Premium: AI-powered meal planning",
        "Premium: Weekly meal plans with shopping lists",
        "View daily nutrition summaries and trends"
      ]
    },
    {
      icon: MessageSquare,
      title: "AI Coaching",
      badge: "Free & Premium",
      description: "Get personalized coaching advice",
      details: [
        "Chat with AI coach for fitness guidance",
        "Free users: 3 coaching interactions per day",
        "Premium users: Unlimited AI coaching",
        "Get workout recommendations",
        "Receive nutrition advice",
        "Ask questions about form, recovery, and goals"
      ]
    },
    {
      icon: Heart,
      title: "Mental Wellness",
      badge: "All Users",
      description: "Track your overall wellbeing",
      details: [
        "Daily wellness check-ins",
        "Rate your mood, energy, and stress levels",
        "Track sleep quality",
        "Log daily activities and notes",
        "View wellness trends over time",
        "Identify patterns between fitness and mental health"
      ]
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      badge: "Premium",
      description: "Detailed insights into your journey",
      details: [
        "Weekly progress reports",
        "Track weight, body measurements, and fitness metrics",
        "View workout volume and consistency",
        "Monitor nutrition adherence",
        "Identify strengths and areas for improvement",
        "Export health data in multiple formats"
      ]
    },
    {
      icon: ShoppingBag,
      title: "Fitness Shop",
      badge: "All Users",
      description: "Curated fitness products and gear",
      details: [
        "Browse equipment, supplements, and apparel",
        "Filter by category and price",
        "Read detailed product descriptions",
        "View ratings and reviews",
        "Get personalized product recommendations",
        "Shop from trusted fitness brands"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I upgrade to Premium?",
      answer: "Click the Crown icon in the header or navigate to your Profile page. You'll see subscription options with detailed feature comparisons. Premium unlocks unlimited workouts, AI coaching, advanced meal planning, and detailed analytics."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your Premium subscription at any time from your Profile page. You'll retain access until the end of your billing period."
    },
    {
      question: "How do I track a workout?",
      answer: "Go to Workouts > Start a Workout. Choose a pre-built program or create your own. During the workout, log each set by entering weight and reps. Complete the workout to save it to your history."
    },
    {
      question: "How accurate is the AI coach?",
      answer: "Our AI coach provides evidence-based fitness guidance. However, it's not a replacement for professional medical advice. Always consult with healthcare professionals for medical concerns."
    },
    {
      question: "How do I log meals?",
      answer: "Navigate to Nutrition and click 'Add Meal'. Search our food database, select items, and log serving sizes. You can also add custom foods or use photo logging (Premium)."
    },
    {
      question: "What are the usage limits for free users?",
      answer: "Free users can track 3 workouts per week and have 3 AI coaching interactions per day. Simple meal logging is unlimited. Upgrade to Premium for unlimited access to all features."
    },
    {
      question: "How do I export my data?",
      answer: "Premium users can export all health data from the Profile page. Choose from PDF, CSV, or JSON formats to download your complete fitness history."
    },
    {
      question: "Can I use the app offline?",
      answer: "The app requires an internet connection for most features. However, your recent data is cached locally for quick access."
    }
  ];

  const gettingStarted = [
    {
      step: 1,
      title: "Complete Your Profile",
      description: "Add your fitness goals, current stats, and preferences for personalized recommendations."
    },
    {
      step: 2,
      title: "Do a Wellness Check-In",
      description: "Start with a daily wellness check-in to establish baseline metrics for mood, energy, and sleep."
    },
    {
      step: 3,
      title: "Choose a Workout Program",
      description: "Browse workout programs that match your goals (strength, cardio, flexibility, etc.) and start your first workout."
    },
    {
      step: 4,
      title: "Log Your First Meal",
      description: "Track your nutrition by logging breakfast, lunch, or dinner. This helps you understand your eating patterns."
    },
    {
      step: 5,
      title: "Chat with Your AI Coach",
      description: "Ask questions, get workout tips, or request personalized advice from your AI fitness coach."
    },
    {
      step: 6,
      title: "Consider Premium",
      description: "If you love the app, upgrade to Premium for unlimited workouts, AI coaching, and advanced meal planning."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <FitMateHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Target className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">User Guide</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know to make the most of FitMatePro
          </p>
        </div>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  App Features Overview
                </CardTitle>
                <CardDescription>
                  Explore everything FitMatePro has to offer
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{feature.badge}</Badge>
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Premium Features Highlight */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  <CardTitle>Premium Exclusive Features</CardTitle>
                </div>
                <CardDescription>
                  Unlock the full potential of FitMatePro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Dumbbell className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Unlimited Workouts</p>
                      <p className="text-sm text-muted-foreground">Track as many workouts as you need</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Unlimited AI Coaching</p>
                      <p className="text-sm text-muted-foreground">24/7 access to your AI coach</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ChefHat className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Advanced Meal Planning</p>
                      <p className="text-sm text-muted-foreground">AI-powered weekly meal plans</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Progress Reports</p>
                      <p className="text-sm text-muted-foreground">Detailed weekly analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-muted-foreground">Download your health data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Palette className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Theme Customization</p>
                      <p className="text-sm text-muted-foreground">Dark mode and custom colors</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Your First Week
                </CardTitle>
                <CardDescription>
                  Follow these steps to get the most out of FitMatePro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {gettingStarted.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{item.step}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Log workouts immediately after completing them for accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Take progress photos weekly to see visual changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Use the AI coach when you're unsure about form or technique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Check in daily for best wellness tracking results</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Community Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Join group classes for motivation and accountability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Share your progress in wellness check-ins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Browse the shop for quality fitness gear recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">Set realistic goals and celebrate small wins</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about FitMatePro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle>Still Have Questions?</CardTitle>
                <CardDescription>
                  We're here to help you succeed on your fitness journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Chat with our AI coach for instant help, or reach out to our support team.
                </p>
                <div className="flex gap-3">
                  <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">AI Coach Support</p>
                    <p className="text-sm text-muted-foreground">
                      Ask your AI coach any questions - available in the Chat section
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Guide;
