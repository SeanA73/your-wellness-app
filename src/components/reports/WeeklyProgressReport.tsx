import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Download,
  BarChart3,
  Lock,
  Sparkles
} from 'lucide-react';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
import { useToast } from '@/hooks/use-toast';

interface WeeklyStats {
  workouts: {
    completed: number;
    planned: number;
    duration: number; // minutes
    calories_burned: number;
  };
  nutrition: {
    avg_calories: number;
    protein_goal: number;
    protein_actual: number;
    consistency: number; // percentage
  };
  wellness: {
    checkins: number;
    avg_energy: number;
    avg_sleep: number;
  };
  achievements: string[];
}

export const WeeklyProgressReport = () => {
  const { hasPremiumAccess } = useSubscription();
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  // Mock data - in real app, fetch from database
  const weeklyStats: WeeklyStats = {
    workouts: {
      completed: 5,
      planned: 6,
      duration: 280,
      calories_burned: 3200
    },
    nutrition: {
      avg_calories: 1950,
      protein_goal: 840,
      protein_actual: 785,
      consistency: 92
    },
    wellness: {
      checkins: 7,
      avg_energy: 7.5,
      avg_sleep: 7.2
    },
    achievements: [
      '5-Day Streak!',
      'Completed 5 Workouts',
      'Consistent Nutrition Tracking'
    ]
  };

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your weekly progress report is ready!",
    });
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your report will download shortly...",
    });
    // Implement actual export logic
  };

  if (!hasPremiumAccess()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Weekly Progress Reports
            <Badge variant="secondary" className="ml-2">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Detailed weekly analytics and insights into your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpgradePrompt 
            trigger="premium_feature_access"
            featureName="Weekly Progress Reports"
          />
        </CardContent>
      </Card>
    );
  }

  const workoutCompletionRate = (weeklyStats.workouts.completed / weeklyStats.workouts.planned) * 100;
  const proteinCompletionRate = (weeklyStats.nutrition.protein_actual / weeklyStats.nutrition.protein_goal) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Weekly Progress Report
              <Badge variant="default" className="ml-2">Premium</Badge>
            </CardTitle>
            <CardDescription>
              Week of {selectedWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{weeklyStats.workouts.completed}</div>
                  <div className="text-xs text-muted-foreground">Workouts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{weeklyStats.nutrition.consistency}%</div>
                  <div className="text-xs text-muted-foreground">Consistency</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{weeklyStats.workouts.duration}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-motivation">{weeklyStats.wellness.checkins}</div>
                  <div className="text-xs text-muted-foreground">Check-ins</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  This Week's Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {weeklyStats.achievements.map((achievement, idx) => (
                    <Badge key={idx} variant="default" className="text-sm py-1">
                      🏆 {achievement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Workout Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Workout Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {weeklyStats.workouts.completed}/{weeklyStats.workouts.planned}
                    </span>
                  </div>
                  <Progress value={workoutCompletionRate} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold">{weeklyStats.workouts.duration}</div>
                    <div className="text-xs text-muted-foreground">Total Minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{weeklyStats.workouts.calories_burned}</div>
                    <div className="text-xs text-muted-foreground">Calories Burned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Protein Goal</span>
                    <span className="text-sm text-muted-foreground">
                      {weeklyStats.nutrition.protein_actual}g / {weeklyStats.nutrition.protein_goal}g
                    </span>
                  </div>
                  <Progress value={proteinCompletionRate} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-2xl font-bold">{weeklyStats.nutrition.avg_calories}</div>
                  <div className="text-xs text-muted-foreground">Average Daily Calories</div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-2xl font-bold text-success">{weeklyStats.nutrition.consistency}%</div>
                  <div className="text-xs text-muted-foreground">Tracking Consistency</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold">{weeklyStats.wellness.checkins}</div>
                    <div className="text-xs text-muted-foreground">Check-ins</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold">{weeklyStats.wellness.avg_energy}/10</div>
                    <div className="text-xs text-muted-foreground">Avg Energy</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/10">
                    <div className="text-2xl font-bold">{weeklyStats.wellness.avg_sleep}h</div>
                    <div className="text-xs text-muted-foreground">Avg Sleep</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

