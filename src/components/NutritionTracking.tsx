import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, Apple, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NutritionTracking = () => {
  const navigate = useNavigate();
  
  const nutritionData = {
    calories: { current: 1420, target: 2000 },
    protein: { current: 85, target: 120 },
    carbs: { current: 180, target: 250 },
    fats: { current: 45, target: 65 },
  };

  const recentMeals = [
    { time: "Breakfast", food: "Oatmeal with berries", calories: 320, status: "Great choice!" },
    { time: "Lunch", food: "Quinoa salad with chicken", calories: 450, status: "Perfect protein!" },
    { time: "Snack", food: "Greek yogurt", calories: 150, status: "Smart snacking!" },
  ];

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Nutrition Tracking</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Camera className="w-4 h-4" />
              Photo
            </Button>
            <Button variant="wellness" size="sm">
              <Plus className="w-4 h-4" />
              Add Food
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Daily Progress */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(nutritionData).map(([key, data]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{key}</span>
                <span className="text-xs text-muted-foreground">
                  {data.current}/{data.target}{key === 'calories' ? '' : 'g'}
                </span>
              </div>
              <Progress 
                value={(data.current / data.target) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Recent Meals */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Today's Meals
          </h4>
          <div className="space-y-3">
            {recentMeals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-calm-gradient rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{meal.time}</Badge>
                    <span className="text-sm font-medium">{meal.food}</span>
                  </div>
                  <p className="text-xs text-success font-medium">{meal.status}</p>
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {meal.calories} cal
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FitMate Suggestion */}
        <div className="bg-motivation-gradient/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Apple className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h5 className="font-semibold text-foreground mb-1">FitMate's Nutrition Tip</h5>
              <p className="text-sm text-muted-foreground mb-2">
                "You're doing great with protein today! For dinner, how about adding some colorful veggies? 
                A rainbow on your plate means a rainbow of nutrients!"
              </p>
              <Button variant="motivation" size="sm" onClick={() => navigate("/nutrition")}>
                Show me recipes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionTracking;