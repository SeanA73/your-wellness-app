import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Heart, Clock, Flame } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const WorkoutSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);

  const workout = {
    title: "Morning Energy Boost",
    duration: 900, // 15 minutes in seconds
    difficulty: "Beginner",
    instructor: "Sarah M.",
    exercises: [
      { name: "Warm-up Stretches", duration: 120, description: "Gentle movements to prepare your body" },
      { name: "Jumping Jacks", duration: 60, description: "Get your heart rate up with classic cardio" },
      { name: "Bodyweight Squats", duration: 90, description: "Strengthen your legs and glutes" },
      { name: "Push-ups (Modified)", duration: 60, description: "Build upper body strength at your pace" },
      { name: "Plank Hold", duration: 45, description: "Core strengthening exercise" },
      { name: "Mountain Climbers", duration: 75, description: "Full body cardio movement" },
      { name: "Cool-down Stretches", duration: 150, description: "Relax and stretch your worked muscles" },
    ]
  };

  const currentExerciseData = workout.exercises[currentExercise];
  const totalProgress = (currentTime / workout.duration) * 100;
  const exerciseProgress = currentExercise < workout.exercises.length ? 
    ((currentTime - workout.exercises.slice(0, currentExercise).reduce((sum, ex) => sum + ex.duration, 0)) / currentExerciseData.duration) * 100 : 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < workout.duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Check if we need to move to next exercise
          let timeSum = 0;
          for (let i = 0; i < workout.exercises.length; i++) {
            timeSum += workout.exercises[i].duration;
            if (newTime <= timeSum && currentExercise !== i) {
              setCurrentExercise(i);
              break;
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, currentExercise, workout.duration, workout.exercises]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetWorkout = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentExercise(0);
  };

  const isCompleted = currentTime >= workout.duration;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/workouts")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Workouts
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{workout.title}</h1>
              <p className="text-sm text-muted-foreground">Instructor: {workout.instructor}</p>
            </div>
            <Badge variant="outline">{workout.difficulty}</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!isCompleted ? (
          <div className="space-y-8">
            {/* Current Exercise */}
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">{currentExerciseData.name}</h2>
                  <p className="text-muted-foreground mb-4">{currentExerciseData.description}</p>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Exercise {currentExercise + 1} of {workout.exercises.length}
                  </Badge>
                </div>

                {/* Timer Display */}
                <div className="text-6xl font-bold text-primary mb-6">
                  {formatTime(workout.duration - currentTime)}
                </div>

                {/* Exercise Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Exercise Progress</span>
                    <span>{Math.round(Math.max(0, Math.min(100, exerciseProgress)))}%</span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, exerciseProgress))} className="h-3 mb-4" />
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="lg" onClick={resetWorkout}>
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </Button>
                  <Button variant="wellness" size="lg" onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? "Pause" : "Start"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Workout Progress</span>
                  <span>{Math.round(totalProgress)}% Complete</span>
                </div>
                <Progress value={totalProgress} className="h-2 mb-4" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(currentTime)} / {formatTime(workout.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      <span>{Math.round((currentTime / workout.duration) * 120)} cal burned</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>145 BPM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise List */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Workout Plan</h3>
                <div className="space-y-2">
                  {workout.exercises.map((exercise, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        index === currentExercise ? 'bg-wellness-gradient/10 border-primary' : 
                        index < currentExercise ? 'bg-success/10 border-success/20' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === currentExercise ? 'bg-primary text-primary-foreground' :
                          index < currentExercise ? 'bg-success text-success-foreground' : 'bg-muted'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-medium">{exercise.name}</span>
                          <p className="text-xs text-muted-foreground">{exercise.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(exercise.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Completion Screen */
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">Workout Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Amazing work! You've completed your {workout.title} session.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatTime(workout.duration)}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">120</div>
                  <div className="text-sm text-muted-foreground">Calories Burned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-wellness">152</div>
                  <div className="text-sm text-muted-foreground">Avg Heart Rate</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/workouts")}>
                  Browse More Workouts
                </Button>
                <Button variant="wellness" onClick={() => navigate("/")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutSession;