import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Camera, Plus, ChefHat, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Nutrition = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [addFoodOpen, setAddFoodOpen] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", calories: "" });
  const { toast } = useToast();

  const nutritionData = {
    calories: { current: 1420, target: 2000 },
    protein: { current: 85, target: 120 },
    carbs: { current: 180, target: 250 },
    fats: { current: 45, target: 65 },
  };

  const featuredRecipes = [
    {
      title: "Protein Power Bowl",
      calories: 420,
      prepTime: "15 min",
      difficulty: "Easy",
      tags: ["High Protein", "Balanced"],
      likes: 234,
      description: "Quinoa, grilled chicken, avocado, and colorful veggies",
      image: "🥗",
    },
    {
      title: "Green Goddess Smoothie",
      calories: 180,
      prepTime: "5 min", 
      difficulty: "Easy",
      tags: ["Low Calorie", "Vitamins"],
      likes: 189,
      description: "Spinach, banana, mango, and coconut water blend",
      image: "🥤",
    },
    {
      title: "Mediterranean Salmon",
      calories: 380,
      prepTime: "25 min",
      difficulty: "Medium",
      tags: ["Omega-3", "Heart Healthy"],
      likes: 156,
      description: "Baked salmon with herbs, olives, and roasted vegetables",
      image: "🐟",
    },
    {
      title: "Overnight Oats Parfait",
      calories: 290,
      prepTime: "5 min prep",
      difficulty: "Easy",
      tags: ["Fiber Rich", "Make Ahead"],
      likes: 201,
      description: "Oats, berries, nuts, and Greek yogurt layers",
      image: "🥣",
    },
  ];

  const recentMeals = [
    { time: "Breakfast", food: "Oatmeal with berries", calories: 320, status: "Great choice!" },
    { time: "Lunch", food: "Quinoa salad with chicken", calories: 450, status: "Perfect protein!" },
    { time: "Snack", food: "Greek yogurt", calories: 150, status: "Smart snacking!" },
  ];

  const filteredRecipes = featuredRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddFood = () => {
    if (newFood.name && newFood.calories) {
      toast({
        title: "Food Added!",
        description: `${newFood.name} (${newFood.calories} calories) has been added to your log.`,
      });
      setNewFood({ name: "", calories: "" });
      setAddFoodOpen(false);
    }
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Nutrition Center</h1>
              <p className="text-sm text-muted-foreground">Track meals and discover healthy recipes</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Camera className="w-4 h-4" />
                Photo
              </Button>
              <Dialog open={addFoodOpen} onOpenChange={setAddFoodOpen}>
                <DialogTrigger asChild>
                  <Button variant="wellness">
                    <Plus className="w-4 h-4" />
                    Add Food
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Food to Log</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="food-name">Food Name</Label>
                      <Input
                        id="food-name"
                        value={newFood.name}
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                        placeholder="e.g., Greek Yogurt with Berries"
                      />
                    </div>
                    <div>
                      <Label htmlFor="food-calories">Calories</Label>
                      <Input
                        id="food-calories"
                        type="number"
                        value={newFood.calories}
                        onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                        placeholder="e.g., 150"
                      />
                    </div>
                    <Button onClick={handleAddFood} className="w-full" variant="wellness">
                      Add to Log
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Recent */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Recent Meals */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMeals.map((meal, index) => (
                  <div key={index} className="p-3 bg-calm-gradient rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{meal.time}</Badge>
                        <span className="text-sm font-medium">{meal.food}</span>
                      </div>
                      <span className="text-sm font-semibold">{meal.calories} cal</span>
                    </div>
                    <p className="text-xs text-success font-medium">{meal.status}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recipes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes by name or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Featured Recipes */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Featured Healthy Recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe, index) => (
                  <Card key={index} className="hover:shadow-card-hover transition-smooth cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3 text-center">{recipe.image}</div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground">{recipe.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.prepTime}
                          </div>
                          <span>{recipe.calories} cal</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {recipe.likes}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 flex-wrap">
                            {recipe.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {recipe.difficulty}
                          </Badge>
                        </div>
                        
                        <Button 
                          variant="motivation" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleViewRecipe(recipe)}
                        >
                          View Recipe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedRecipe.image}</span>
                  {selectedRecipe.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedRecipe.description}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedRecipe.prepTime}
                  </div>
                  <span>{selectedRecipe.calories} calories</span>
                  <span>Difficulty: {selectedRecipe.difficulty}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {selectedRecipe.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="bg-calm-gradient/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Recipe Details</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the full recipe instructions. In a real app, 
                    this would contain the complete ingredient list and step-by-step cooking instructions.
                  </p>
                </div>

                <Button variant="wellness" className="w-full">
                  Start Cooking
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nutrition;