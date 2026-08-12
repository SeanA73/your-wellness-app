import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Target, Activity, Heart } from "lucide-react";
import FitMateHeader from "@/components/FitMateHeader";
import { PersonalizedRecommendations } from "@/components/shop/PersonalizedRecommendations";
import { useProductRecommendations } from "@/hooks/useProductRecommendations";
import { useAuth } from "@/hooks/useAuth";

const Recommendations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { workoutAnalysis, goalAnalysis } = useProductRecommendations({
    context: "general",
    autoGenerate: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <FitMateHeader />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Please sign in to view personalized recommendations.
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FitMateHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Personalised Recommendations</h1>
          </div>
          <p className="text-muted-foreground">
            Personalized fitness gear recommendations based on your workout history, goals, and
            preferences.
          </p>
        </div>

        {/* User Insights */}
        {(workoutAnalysis || goalAnalysis) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {workoutAnalysis && workoutAnalysis.totalWorkouts > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Your Workout Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Workouts (30 days)</span>
                    <Badge variant="secondary">{workoutAnalysis.totalWorkouts}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Primary Types</span>
                    <div className="flex gap-1">
                      {workoutAnalysis.primaryWorkoutTypes.slice(0, 2).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <Badge variant="secondary">
                      {workoutAnalysis.averageFrequency.toFixed(1)}x/week
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Intensity</span>
                    <Badge
                      variant={
                        workoutAnalysis.intensityLevel === "high"
                          ? "destructive"
                          : workoutAnalysis.intensityLevel === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {workoutAnalysis.intensityLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {goalAnalysis && goalAnalysis.activeGoals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Your Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Primary Goal</span>
                    <Badge variant="default" className="capitalize">
                      {goalAnalysis.primaryGoal?.replace("_", " ") || "Not set"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {goalAnalysis.activeGoals.map((goal) => (
                      <Badge key={goal} variant="outline" className="text-xs capitalize">
                        {goal.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Recommendations by Context */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PersonalizedRecommendations
              context="general"
              limit={12}
              title="All Recommendations"
              autoGenerate={true}
            />
          </TabsContent>

          <TabsContent value="workout" className="mt-6">
            <PersonalizedRecommendations
              context="workout_planning"
              limit={12}
              title="Workout Equipment"
              autoGenerate={true}
            />
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <PersonalizedRecommendations
              context="goal_based"
              limit={12}
              title="Goal-Based Recommendations"
              autoGenerate={true}
            />
          </TabsContent>

          <TabsContent value="recovery" className="mt-6">
            <PersonalizedRecommendations
              context="post_workout"
              limit={12}
              title="Recovery & Wellness"
              autoGenerate={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Recommendations;



