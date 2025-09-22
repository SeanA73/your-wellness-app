import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Clock, Users, Flame, Filter, Play, Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { preBuiltPrograms, WorkoutProgram } from "@/data/workoutPrograms";
import WorkoutProgramCard from "@/components/workout/WorkoutProgramCard";
import CreateWorkoutForm from "@/components/workout/CreateWorkoutForm";

const Workouts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("programs");
  const [customPrograms, setCustomPrograms] = useState<WorkoutProgram[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);

  const workoutCategories = [
    { name: "HIIT", count: 45, color: "bg-motivation-gradient" },
    { name: "Yoga", count: 32, color: "bg-calm-gradient" },
    { name: "Strength", count: 28, color: "bg-success" },
    { name: "Cardio", count: 38, color: "bg-wellness-gradient" },
  ];

  const allWorkouts = [
    {
      title: "Morning Energy Boost",
      duration: "15 min",
      difficulty: "Beginner",
      calories: "80-120",
      type: "HIIT",
      participants: 247,
      description: "Perfect start to your day with energizing movements",
      instructor: "Sarah M.",
      rating: 4.8,
    },
    {
      title: "Full Body Power Hour", 
      duration: "60 min",
      difficulty: "Advanced",
      calories: "400-550",
      type: "Strength",
      participants: 189,
      description: "Comprehensive strength training for all muscle groups",
      instructor: "Mike T.",
      rating: 4.9,
    },
    {
      title: "Sunset Yoga Flow",
      duration: "45 min", 
      difficulty: "Intermediate",
      calories: "150-200",
      type: "Yoga",
      participants: 312,
      description: "Relaxing flow to unwind and stretch after a long day",
      instructor: "Luna K.",
      rating: 4.7,
    },
    {
      title: "Cardio Dance Party",
      duration: "30 min",
      difficulty: "All Levels", 
      calories: "200-300",
      type: "Cardio",
      participants: 156,
      description: "Fun dance moves that'll get your heart pumping",
      instructor: "Carlos R.",
      rating: 4.6,
    },
    {
      title: "Core Strength Builder",
      duration: "20 min",
      difficulty: "Intermediate",
      calories: "120-180",
      type: "Strength", 
      participants: 203,
      description: "Targeted core workout for stability and strength",
      instructor: "Emma L.",
      rating: 4.8,
    },
    {
      title: "Mindful Morning Stretch",
      duration: "25 min",
      difficulty: "Beginner",
      calories: "60-90",
      type: "Yoga",
      participants: 278,
      description: "Gentle stretches to awaken your body mindfully",
      instructor: "David P.",
      rating: 4.5,
    },
  ];

  const filteredWorkouts = allWorkouts.filter(workout =>
    workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allPrograms = [...preBuiltPrograms, ...customPrograms];
  
  const filteredPrograms = allPrograms.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.goals.some(goal => goal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartProgram = (programId: string) => {
    navigate(`/program/${programId}`);
  };

  const handleCustomizeProgram = (programId: string) => {
    const program = allPrograms.find(p => p.id === programId);
    if (program) {
      setEditingProgram(program);
      setShowCreateForm(true);
    }
  };

  const handleSaveProgram = (program: WorkoutProgram) => {
    if (editingProgram) {
      setCustomPrograms(prev => prev.map(p => p.id === program.id ? program : p));
      setEditingProgram(null);
    } else {
      setCustomPrograms(prev => [...prev, program]);
    }
    setShowCreateForm(false);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingProgram(null);
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
              <h1 className="text-2xl font-bold">Browse Workouts</h1>
              <p className="text-sm text-muted-foreground">Find the perfect workout for your goals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showCreateForm ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={handleCancelForm}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold">
                {editingProgram ? 'Customize Program' : 'Create New Program'}
              </h2>
            </div>
            <CreateWorkoutForm
              initialProgram={editingProgram || undefined}
              onSave={handleSaveProgram}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <>
            {/* Search & Filters */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs and workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Program
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="programs">Workout Programs</TabsTrigger>
                <TabsTrigger value="individual">Individual Workouts</TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="space-y-8">
                {/* Program Categories */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Categories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {['All', 'Weightlifting', 'Bodybuilding', 'General Fitness', 'Cardio', 'Strength', 'Powerlifting'].map((category) => (
                      <Card key={category} className="cursor-pointer hover:shadow-card-hover transition-smooth">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <Target className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-sm">{category}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Workout Programs */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Available Programs ({filteredPrograms.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                      <WorkoutProgramCard
                        key={program.id}
                        program={program}
                        onStart={handleStartProgram}
                        onCustomize={handleCustomizeProgram}
                      />
                    ))}
                  </div>
                  {filteredPrograms.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No programs found matching your search.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="individual" className="space-y-8">

                {/* Categories */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Categories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {workoutCategories.map((category) => (
                      <Card key={category.name} className="cursor-pointer hover:shadow-card-hover transition-smooth">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg`}>
                            {category.count}
                          </div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.count} workouts</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Workout List */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">All Workouts ({filteredWorkouts.length})</h2>
                  <div className="grid gap-4">
                    {filteredWorkouts.map((workout, index) => (
                      <Card key={index} className="hover:shadow-card-hover transition-smooth">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{workout.title}</h3>
                                <Badge variant="outline">{workout.type}</Badge>
                                <Badge variant={workout.difficulty === "Beginner" ? "secondary" : workout.difficulty === "Advanced" ? "destructive" : "default"}>
                                  {workout.difficulty}
                                </Badge>
                              </div>
                              
                              <p className="text-muted-foreground mb-3">{workout.description}</p>
                              
                              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {workout.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Flame className="w-4 h-4" />
                                  {workout.calories} cal
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {workout.participants} joined
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">Instructor: {workout.instructor}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="font-medium">{workout.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button variant="wellness" onClick={() => navigate(`/workout/${index}`)}>
                                <Play className="w-4 h-4" />
                                Start Workout
                              </Button>
                              <Button variant="outline" size="sm">
                                Preview
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Workouts;