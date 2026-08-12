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
  ChefHat,
  Award,
  Shield,
  BarChart3,
  MousePointerClick,
  DollarSign,
  Info,
  PlayCircle,
  Clock
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
    },
    {
      icon: Award,
      title: "Coach's Picks",
      badge: "All Users",
      description: "Curated product recommendations from fitness experts",
      details: [
        "Browse hand-selected fitness products and gear",
        "Filter by category: Equipment, Nutrition, Recovery, Apparel",
        "View featured products with exclusive deals",
        "See contextual recommendations based on your workouts",
        "Get suggestions matched to your fitness goals",
        "Products earn commission to support app development"
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
    },
    {
      question: "What is Coach's Picks?",
      answer: "Coach's Picks is a curated selection of fitness products recommended by our team. These include equipment, supplements, apparel, and recovery tools that align with your fitness journey. When you purchase through our links, we earn a small commission that helps support the app's development at no extra cost to you."
    },
    {
      question: "Are the product recommendations personalized?",
      answer: "Yes! Product recommendations are contextual based on your activities. For example, after logging strength workouts, you'll see equipment recommendations. After tracking meals, you'll see nutrition products. This ensures the suggestions are relevant to your current fitness focus."
    },
    {
      question: "How do I access the admin dashboard?",
      answer: "The admin dashboard is only accessible to users with administrator privileges. If you're an admin, you'll see an 'Admin' link in the navigation menu. The dashboard provides insights into user engagement, subscription metrics, and affiliate performance."
    },
    {
      question: "How does the role system work?",
      answer: "FitMatePro uses a secure role-based access system. Regular users have standard access, while administrators can view analytics and manage the platform. Roles are stored securely in the database and verified server-side to prevent unauthorized access."
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
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
                <Target className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                User Guide
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to know to make the most of <span className="text-primary font-semibold">FitMatePro</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Dumbbell className="w-4 h-4 mr-2" />
                Workout Tracking
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Apple className="w-4 h-4 mr-2" />
                Nutrition Plans
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Coaching
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress Analytics
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="advanced">Admin & Advanced</TabsTrigger>
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

          {/* Admin & Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            {/* Affiliate Disclosure */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600" />
                  <CardTitle>Affiliate Disclosure</CardTitle>
                </div>
                <CardDescription>
                  Transparency about our product recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  FitMatePro participates in affiliate marketing programs, including Amazon Associates and other fitness retailers. 
                  When you purchase products through our "Coach's Picks" or product recommendations, we may earn a small commission 
                  at no additional cost to you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">No Extra Cost</p>
                      <p className="text-sm text-muted-foreground">
                        Prices remain the same whether you use our links or not
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Supports Development</p>
                      <p className="text-sm text-muted-foreground">
                        Commissions help us maintain and improve the app
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Honest Recommendations</p>
                      <p className="text-sm text-muted-foreground">
                        We only recommend products we believe will benefit your fitness journey
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Contextual & Personalized</p>
                      <p className="text-sm text-muted-foreground">
                        Suggestions are based on your workouts, nutrition, and goals
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Dashboard */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle>Admin Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Platform analytics and management (Admin access required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Dashboard Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">User Analytics</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Total users and subscription breakdown</li>
                        <li>• Active subscriptions and conversion rates</li>
                        <li>• Recent user registrations</li>
                        <li>• User engagement metrics</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Revenue Tracking</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Total revenue from all sources</li>
                        <li>• Subscription revenue breakdown</li>
                        <li>• Premium conversion metrics</li>
                        <li>• Revenue trends and projections</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Feature Usage</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• AI coaching interactions</li>
                        <li>• Workout and nutrition tracking</li>
                        <li>• Wellness check-ins</li>
                        <li>• Goal setting engagement</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Affiliate Analytics</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Total clicks and conversions</li>
                        <li>• Conversion rate tracking</li>
                        <li>• Top performing products</li>
                        <li>• Commission revenue reports</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <MousePointerClick className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Accessing the Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        Only users with administrator privileges can access the admin dashboard. 
                        Look for the "Admin" link in the navigation menu if you have admin access.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role System */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Role-Based Access System</CardTitle>
                </div>
                <CardDescription>
                  How user roles and permissions work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Regular User</p>
                        <p className="text-sm text-muted-foreground">
                          Standard access to all fitness features including workouts, nutrition tracking, 
                          AI coaching, and wellness check-ins. Can upgrade to Premium for advanced features.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Shield className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Administrator</p>
                        <p className="text-sm text-muted-foreground">
                          Full platform access including the admin dashboard with analytics, user management, 
                          revenue tracking, and affiliate performance metrics. Required for platform moderation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Moderator</p>
                        <p className="text-sm text-muted-foreground">
                          Limited administrative access for community management and content moderation. 
                          Can review user-generated content and manage community guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-2">Security & Privacy</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Roles are stored securely in a dedicated database table</li>
                        <li>• All permissions are verified server-side, not client-side</li>
                        <li>• Users cannot self-assign admin or moderator roles</li>
                        <li>• Role changes are logged for audit purposes</li>
                        <li>• Admins can only be assigned by other administrators</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliate Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <CardTitle>Understanding Affiliate Metrics</CardTitle>
                </div>
                <CardDescription>
                  How we track and measure product recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Click Tracking</p>
                      <p className="text-sm text-muted-foreground">
                        Every time you click on a product recommendation, we track which product 
                        was clicked and from which page. This helps us understand which recommendations 
                        are most helpful to users.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Conversion Tracking</p>
                      <p className="text-sm text-muted-foreground">
                        When a purchase is made through our affiliate links, it's recorded as a conversion. 
                        This helps us measure the effectiveness of our recommendations and earn commission.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Conversion Rate</p>
                      <p className="text-sm text-muted-foreground">
                        The percentage of clicks that result in purchases. A higher conversion rate means 
                        our recommendations are well-matched to user needs.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Top Products</p>
                      <p className="text-sm text-muted-foreground">
                        We track which products get the most clicks and conversions to feature the most 
                        popular and useful items in Coach's Picks.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  Video Tutorials
                </CardTitle>
                <CardDescription>
                  Step-by-step video guides to help you master FitMatePro
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Getting Started Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Getting Started</CardTitle>
                <CardDescription>
                  New to FitMatePro? Start here with these essential tutorials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Account Setup & First Steps</p>
                        </div>
                      </div>
                      {/* Placeholder for video embed */}
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Account Setup & First Steps"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Account Setup & First Steps</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>5:30</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Learn how to create your account, complete your profile, and navigate the dashboard
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Setting Your Fitness Goals</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Setting Your Fitness Goals"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Setting Your Fitness Goals</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>4:15</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Define your fitness objectives and let FitMatePro create a personalized plan
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workout Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  Workout Tracking
                </CardTitle>
                <CardDescription>
                  Master workout logging and planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">How to Log a Workout</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="How to Log a Workout"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">How to Log a Workout</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>6:45</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Step-by-step guide to tracking your workouts, sets, reps, and weight
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Creating Custom Workouts</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Creating Custom Workouts"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Creating Custom Workouts</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>8:20</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Build personalized workout plans tailored to your goals and preferences
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Apple className="w-5 h-5 text-primary" />
                  Nutrition Tracking
                </CardTitle>
                <CardDescription>
                  Learn to track your meals and hit your macro goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Logging Your Meals</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Logging Your Meals"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Logging Your Meals</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>5:50</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Quick and easy meal logging with barcode scanning and food database search
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Understanding Macros</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Understanding Macros"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Understanding Macros</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>7:30</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Learn about protein, carbs, and fats and how to balance them for your goals
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Coaching Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  AI Coaching
                </CardTitle>
                <CardDescription>
                  Get the most out of your AI fitness coach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Using AI Coach</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Using AI Coach"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Using AI Coach</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>6:00</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get personalized advice, workout suggestions, and form tips from your AI coach
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Analyzing Your Progress</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Analyzing Your Progress"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Analyzing Your Progress</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>5:15</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Review your progress reports and understand your fitness trends
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features Videos */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Premium Features
                </CardTitle>
                <CardDescription>
                  Advanced tutorials for Premium subscribers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">AI Meal Planning</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="AI Meal Planning"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">AI Meal Planning</h3>
                        <Badge variant="default" className="text-xs">Premium</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>9:00</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Let AI create personalized weekly meal plans with shopping lists
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border relative group">
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <div className="text-center space-y-2">
                          <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-sm font-medium">Advanced Analytics</p>
                        </div>
                      </div>
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Advanced Analytics"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Advanced Analytics</h3>
                        <Badge variant="default" className="text-xs">Premium</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>7:45</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Deep dive into your progress reports and performance metrics
                      </p>
                    </div>
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
