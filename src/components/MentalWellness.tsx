import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Smile, Wind } from "lucide-react";

const MentalWellness = () => {
  const wellnessActivities = [
    {
      title: "5-Minute Breathing",
      description: "Quick stress relief technique",
      duration: "5 min",
      type: "Mindfulness",
      icon: Wind,
      participants: 89,
      variant: "calm" as const,
    },
    {
      title: "Gratitude Journal",
      description: "Reflect on today's positive moments",
      duration: "10 min",
      type: "Reflection",
      icon: Heart,
      participants: 156,
      variant: "wellness" as const,
    },
    {
      title: "Mood Check-In",
      description: "Track your emotional wellness",
      duration: "3 min",
      type: "Assessment",
      icon: Smile,
      participants: 203,
      variant: "motivation" as const,
    },
  ];

  const moodData = {
    current: "Optimistic",
    trend: "improving",
    streak: 4,
    insight: "Your mood has been trending upward this week! Regular exercise and good sleep are really paying off.",
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Mental Wellness
          </CardTitle>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            {moodData.streak} day streak
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Mood */}
        <div className="bg-calm-gradient rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Today's Mood</h4>
            <span className="text-lg">😊</span>
          </div>
          <p className="text-lg font-medium text-foreground mb-1">{moodData.current}</p>
          <p className="text-sm text-muted-foreground">{moodData.insight}</p>
        </div>

        {/* Wellness Activities */}
        <div>
          <h4 className="font-semibold mb-3">Recommended Activities</h4>
          <div className="space-y-3">
            {wellnessActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:shadow-card transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-wellness-gradient/10 rounded-full flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{activity.title}</h5>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                      <span className="text-xs text-muted-foreground">{activity.duration}</span>
                      <span className="text-xs text-muted-foreground">• {activity.participants} active</span>
                    </div>
                  </div>
                </div>
                <Button variant={activity.variant} size="sm">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* FitMate Wellness Insight */}
        <div className="bg-motivation-gradient/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h5 className="font-semibold text-foreground mb-1">Wellness Insight</h5>
              <p className="text-sm text-muted-foreground mb-2">
                "I've noticed you're most energetic after morning workouts and seem more relaxed after your evening breathing exercises. Want to make this a consistent routine?"
              </p>
              <Button variant="motivation" size="sm">
                Create Routine
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalWellness;