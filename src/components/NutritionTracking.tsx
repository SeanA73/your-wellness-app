import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, Apple, Utensils, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const NutritionTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [photoAnalysisOpen, setPhotoAnalysisOpen] = useState(false);
  const [analyzedFood, setAnalyzedFood] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  
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

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzePhoto(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzePhoto = async (file) => {
    setIsAnalyzing(true);
    setPhotoAnalysisOpen(true);
    
    // Simulate AI analysis - in real app, this would call an AI service
    setTimeout(() => {
      const mockAnalysis = {
        foodName: "Grilled Chicken Salad",
        calories: 340,
        protein: 32,
        carbs: 12,
        fats: 18,
        fiber: 4,
        ingredients: ["Grilled chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil dressing"],
        confidence: 85
      };
      
      setAnalyzedFood(mockAnalysis);
      setIsAnalyzing(false);
      
      toast({
        title: "Photo Analyzed!",
        description: `Detected ${mockAnalysis.foodName} with ${mockAnalysis.calories} calories`,
      });
    }, 2000);
  };

  const addAnalyzedFood = () => {
    if (analyzedFood) {
      toast({
        title: "Food Added!",
        description: `${analyzedFood.foodName} has been added to your nutrition log.`,
      });
      setPhotoAnalysisOpen(false);
      setAnalyzedFood(null);
    }
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
            <Button variant="wellness" size="sm" onClick={handleCameraCapture}>
              <Camera className="w-4 h-4" />
              Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
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
            <div className="flex-1">
              <h5 className="font-semibold text-foreground mb-1">FitMate's Nutrition Tip</h5>
              <p className="text-sm text-muted-foreground mb-2">
                {user 
                  ? "You're doing great with protein today! For dinner, how about adding some colorful veggies? A rainbow on your plate means a rainbow of nutrients!"
                  : "Track your nutrition and get personalized tips from FitMate! Sign in to save your progress and get AI-powered coaching."
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

      {/* Photo Analysis Dialog */}
      <Dialog open={photoAnalysisOpen} onOpenChange={setPhotoAnalysisOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Camera className="w-5 h-5" />
              Food Photo Analysis
            </DialogTitle>
          </DialogHeader>
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Analyzing your food photo...</p>
            </div>
          ) : analyzedFood ? (
            <div className="space-y-6">
              <div className="bg-success-gradient/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{analyzedFood.foodName}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Analysis confidence: {analyzedFood.confidence}%
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analyzedFood.calories}</div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{analyzedFood.protein}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-motivation">{analyzedFood.carbs}g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-calm">{analyzedFood.fats}g</div>
                    <div className="text-xs text-muted-foreground">Fats</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Detected Ingredients:</h4>
                  <div className="flex gap-1 flex-wrap">
                    {analyzedFood.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="wellness" onClick={addAnalyzedFood} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Food Log
                </Button>
                <Button variant="outline" onClick={() => setPhotoAnalysisOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NutritionTracking;