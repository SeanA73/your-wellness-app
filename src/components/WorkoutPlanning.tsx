import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";

const WorkoutPlanning = () => {
  const navigate = useNavigate();
  
  const workoutPlans = [
    {
      title: "Morning Energy Boost",
      duration: "15 min",
      difficulty: "Beginner",
      calories: "80-120",
      type: "HIIT",
      participants: 247,
      description: "Perfect start to your day with energizing movements",
      variant: "motivation" as const,
    },
    {
      title: "Strength & Mindfulness",
      duration: "30 min",
      difficulty: "Intermediate", 
      calories: "150-200",
      type: "Yoga + Strength",
      participants: 189,
      description: "Balance building with calming flow sequences",
      variant: "wellness" as const,
    },
    {
      title: "Evening Wind Down",
      duration: "20 min",
      difficulty: "All Levels",
      calories: "60-90",
      type: "Gentle Yoga",
      participants: 312,
      description: "Relaxing movements to prepare for restful sleep",
      variant: "calm" as const,
    },
  ];

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Today's Workouts</CardTitle>
          <Button variant="outline" size="sm">
            <Target className="w-4 h-4" />
            Customize
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {workoutPlans.map((workout, index) => (
          <div 
            key={index} 
            className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{workout.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workout.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {workout.calories} cal
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {workout.participants} joined
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="text-xs">
                  {workout.difficulty}
                </Badge>
                <Button variant={workout.variant} size="sm" onClick={() => navigate(`/workout/${index}`)}>
                  Start Workout
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full" onClick={() => navigate("/workouts")}>
            Browse All Workouts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutPlanning;