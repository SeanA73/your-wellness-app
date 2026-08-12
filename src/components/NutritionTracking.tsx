import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Apple, Utensils, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNutrition } from "@/hooks/useNutrition";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";

const NutritionTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { todaysMeals, loading, getTodaysNutrition } = useNutrition();
  const [addFoodOpen, setAddFoodOpen] = useState(false);
  const [newFood, setNewFood] = useState({ 
    name: "", 
    calories: "", 
    protein: "", 
    carbs: "", 
    fats: "", 
    fiber: "", 
    servingSize: "", 
    mealType: "",
    notes: ""
  });
  const { toast } = useToast();
  
  // Calculate nutrition data from today's meals
  const todaysNutrition = getTodaysNutrition();
  const nutritionData = {
    calories: { current: todaysNutrition.calories, target: 2000 },
    protein: { current: todaysNutrition.protein, target: 120 },
    carbs: { current: todaysNutrition.carbs, target: 250 },
    fats: { current: todaysNutrition.fat, target: 65 },
  };

  const handleAddFood = () => {
    if (newFood.name && newFood.calories) {
      const nutritionSummary = [
        newFood.calories && `${newFood.calories} calories`,
        newFood.protein && `${newFood.protein}g protein`,
        newFood.carbs && `${newFood.carbs}g carbs`,
        newFood.fats && `${newFood.fats}g fats`
      ].filter(Boolean).join(", ");
      
      toast({
        title: "Food Added!",
        description: user 
          ? `${newFood.name} (${nutritionSummary}) added to your ${newFood.mealType || 'nutrition'} log.`
          : `${newFood.name} logged temporarily. Sign in to save your data permanently!`,
      });
      
      setNewFood({ 
        name: "", 
        calories: "", 
        protein: "", 
        carbs: "", 
        fats: "", 
        fiber: "", 
        servingSize: "", 
        mealType: "",
        notes: ""
      });
      setAddFoodOpen(false);
    }
  };


  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Nutrition Tracking</CardTitle>
          <div className="flex gap-2">
            <Dialog open={addFoodOpen} onOpenChange={setAddFoodOpen}>
              <DialogTrigger asChild>
                <Button variant="wellness" size="sm">
                  <Plus className="w-4 h-4" />
                  Add Food
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Food to Log</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="food-name">Food Name *</Label>
                      <Input
                        id="food-name"
                        value={newFood.name}
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                        placeholder="e.g., Greek Yogurt with Berries"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="meal-type">Meal Type</Label>
                      <Select value={newFood.mealType} onValueChange={(value) => setNewFood({...newFood, mealType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="serving-size">Serving Size</Label>
                      <Input
                        id="serving-size"
                        value={newFood.servingSize}
                        onChange={(e) => setNewFood({...newFood, servingSize: e.target.value})}
                        placeholder="e.g., 1 cup, 100g"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="food-calories">Calories *</Label>
                      <Input
                        id="food-calories"
                        type="number"
                        value={newFood.calories}
                        onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                        placeholder="150"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="food-protein">Protein (g)</Label>
                      <Input
                        id="food-protein"
                        type="number"
                        value={newFood.protein}
                        onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                        placeholder="12"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="food-carbs">Carbs (g)</Label>
                      <Input
                        id="food-carbs"
                        type="number"
                        value={newFood.carbs}
                        onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                        placeholder="20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="food-fats">Fats (g)</Label>
                      <Input
                        id="food-fats"
                        type="number"
                        value={newFood.fats}
                        onChange={(e) => setNewFood({...newFood, fats: e.target.value})}
                        placeholder="5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="food-fiber">Fiber (g)</Label>
                      <Input
                        id="food-fiber"
                        type="number"
                        value={newFood.fiber}
                        onChange={(e) => setNewFood({...newFood, fiber: e.target.value})}
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="food-notes">Notes (optional)</Label>
                    <Textarea
                      id="food-notes"
                      value={newFood.notes}
                      onChange={(e) => setNewFood({...newFood, notes: e.target.value})}
                      placeholder="Any additional notes about preparation, brand, etc."
                      rows={2}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddFood} 
                    className="w-full" 
                    variant="wellness"
                    disabled={!newFood.name || !newFood.calories}
                  >
                    Add to Log
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
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
          </>
        )}

        {/* Recent Meals */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Today's Meals
          </h4>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : todaysMeals && todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {todaysMeals.map((meal, index) => (
                <div key={meal.id || index} className="flex items-center justify-between p-3 bg-calm-gradient rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">{meal.meal_type || 'meal'}</Badge>
                      <span className="text-sm font-medium">{meal.description || 'Meal'}</span>
                    </div>
                    {meal.food_items && Array.isArray(meal.food_items) && meal.food_items.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {meal.food_items.map((item: any) => item.name || item).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">
                    {meal.total_calories || 0} cal
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              iconEmoji="🍽️"
              title="No meals logged today"
              description="Start tracking your nutrition by adding your first meal!"
              actionLabel="Add Food"
              onAction={() => setAddFoodOpen(true)}
            />
          )}
        </div>

        {/* FitMate Suggestion */}
        <div className="bg-motivation-gradient/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Apple className="w-5 h-5 text-accent mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold text-foreground mb-1">FitMatePro's Nutrition Tip</h5>
              <p className="text-sm text-muted-foreground mb-2">
                {user 
                  ? "You're doing great with protein today! For dinner, how about adding some colorful veggies? A rainbow on your plate means a rainbow of nutrients!"
                  : "Track your nutrition and log your meals. Sign in to save your progress."
                }
              </p>
              <div className="flex gap-2">
                <Button variant="motivation" size="sm" onClick={() => navigate("/nutrition")}>
                  {user ? "Show me recipes" : "Explore recipes"}
                </Button>
                {!user && (
                  <Button variant="wellness" size="sm" onClick={() => navigate("/auth")}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

    </Card>
  );
};

export default NutritionTracking;