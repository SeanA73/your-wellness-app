import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar, Target } from "lucide-react";

const ProgressVisualization = () => {
  const weeklyProgress = [
    { day: "Mon", workouts: 1, mood: 8 },
    { day: "Tue", workouts: 1, mood: 7 },
    { day: "Wed", workouts: 0, mood: 6 },
    { day: "Thu", workouts: 2, mood: 9 },
    { day: "Fri", workouts: 1, mood: 8 },
    { day: "Sat", workouts: 1, mood: 9 },
    { day: "Sun", workouts: 1, mood: 8 },
  ];

  const achievements = [
    { title: "7-Day Streak", description: "Completed check-ins", icon: "🔥", unlocked: true },
    { title: "Hydration Hero", description: "Met water goal 5 days", icon: "💧", unlocked: true },
    { title: "Early Bird", description: "Morning workouts", icon: "🌅", unlocked: false },
  ];

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Progress Overview</CardTitle>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4" />
            View History
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Weekly Progress Chart */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            This Week's Activity
          </h4>
          <div className="flex items-end justify-between gap-2 h-24 mb-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div className="relative w-full max-w-6">
                  {/* Workout bars */}
                  <div 
                    className="bg-primary rounded-t w-full transition-all duration-300"
                    style={{ height: `${day.workouts * 15 + 10}px` }}
                  />
                  {/* Mood overlay */}
                  <div 
                    className="absolute bottom-0 bg-accent/30 rounded-t w-full transition-all duration-300"
                    style={{ height: `${day.mood * 2}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded"></div>
              Workouts
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent/30 rounded"></div>
              Mood Level
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg border transition-smooth ${
                  achievement.unlocked 
                    ? 'bg-success/5 border-success/20 hover:bg-success/10' 
                    : 'bg-muted/30 border-border hover:bg-muted/50'
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h5 className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </h5>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Unlocked!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-wellness-gradient/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h5 className="font-semibold">This Week's Goal</h5>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Complete 5 workouts and maintain consistent sleep schedule
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress: 6/7 days</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              On Track!
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressVisualization;