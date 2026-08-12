import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar, Target, LogIn, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "./EmptyState";

interface DayStat {
  day: string;
  workouts: number;
  mood: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ProgressVisualization = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Real per-day activity for the trailing 7 days. Previously this was a
  // hardcoded array rendered to signed-in users as if it were their own data.
  const [weeklyProgress, setWeeklyProgress] = useState<DayStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingStats(false);
      return;
    }

    const loadWeek = async () => {
      setLoadingStats(true);

      const since = new Date();
      since.setDate(since.getDate() - 6);
      since.setHours(0, 0, 0, 0);

      // seed 7 empty buckets, oldest first
      const buckets: DayStat[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(since);
        d.setDate(since.getDate() + i);
        return { day: DAY_LABELS[d.getDay()], workouts: 0, mood: 0 };
      });
      const indexFor = (iso: string) => {
        const d = new Date(iso);
        d.setHours(0, 0, 0, 0);
        return Math.round((d.getTime() - since.getTime()) / 86400000);
      };

      const [sessions, checkins] = await Promise.all([
        supabase
          .from("workout_sessions")
          .select("start_time")
          .eq("user_id", user.id)
          .eq("completed", true)
          .gte("start_time", since.toISOString()),
        supabase
          .from("wellness_checkins")
          .select("checked_in_at, mood_rating")
          .eq("user_id", user.id)
          .gte("checked_in_at", since.toISOString()),
      ]);

      if (sessions.error) console.error("[progress] workout_sessions:", sessions.error);
      if (checkins.error) console.error("[progress] wellness_checkins:", checkins.error);

      for (const row of sessions.data ?? []) {
        const i = indexFor(row.start_time);
        if (i >= 0 && i < 7) buckets[i].workouts += 1;
      }
      for (const row of checkins.data ?? []) {
        const i = indexFor(row.checked_in_at);
        if (i >= 0 && i < 7) buckets[i].mood = Math.max(buckets[i].mood, row.mood_rating ?? 0);
      }

      setWeeklyProgress(buckets);
      setLoadingStats(false);
    };

    loadWeek();
  }, [user]);

  const demoProgress = [
    { day: "Mon", workouts: 0, mood: 5 },
    { day: "Tue", workouts: 0, mood: 5 },
    { day: "Wed", workouts: 0, mood: 5 },
    { day: "Thu", workouts: 0, mood: 5 },
    { day: "Fri", workouts: 0, mood: 5 },
    { day: "Sat", workouts: 0, mood: 5 },
    { day: "Sun", workouts: 0, mood: 5 },
  ];

  const demoAchievements = [
    { title: "First Steps", description: "Start your fitness journey", icon: "👟", unlocked: false },
    { title: "Hydration Hero", description: "Track your water intake", icon: "💧", unlocked: false },
    { title: "Early Bird", description: "Morning workouts", icon: "🌅", unlocked: false },
  ];

  // Show different content based on authentication status
  if (!user) {
    return (
      <Card className="shadow-card hover:shadow-card-hover transition-smooth">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Track Your Progress
            </CardTitle>
            <Button variant="wellness" size="sm" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Demo Progress Chart */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly Activity Tracking
            </h4>
            <div className="flex items-end justify-between gap-2 h-24 mb-2 opacity-50">
              {demoProgress.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div className="relative w-full max-w-6">
                    <div 
                      className="bg-muted rounded-t w-full transition-all duration-300"
                      style={{ height: "15px" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Your progress chart will appear here once you start tracking workouts and mood
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>

          {/* Demo Achievements */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Unlock Achievements
            </h4>
            <div className="space-y-2">
              {demoAchievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 border-border opacity-60"
                >
                  <span className="text-2xl grayscale">{achievement.icon}</span>
                  <div className="flex-1">
                    <h5 className="font-medium text-muted-foreground">
                      {achievement.title}
                    </h5>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">
                    Locked
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-wellness-gradient/10 border border-primary/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <h5 className="font-semibold">Start Your Fitness Journey</h5>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to set goals, track progress, and unlock achievements as you build healthy habits
            </p>
            <Button variant="wellness" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAnyActivity = weeklyProgress.some(d => d.workouts > 0 || d.mood > 0);
  const totalWorkouts = weeklyProgress.reduce((sum, d) => sum + d.workouts, 0);

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Progress Overview</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/workouts")}>
            <Calendar className="w-4 h-4" />
            View Workouts
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {loadingStats ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : !hasAnyActivity ? (
          <EmptyState
            iconEmoji="📊"
            title="No activity yet this week"
            description="Complete a workout or a daily check-in and your weekly progress will appear here."
            actionLabel="Start a workout"
            onAction={() => navigate("/workouts")}
          />
        ) : (
          <>
            {/* Weekly Progress Chart — real workout_sessions + wellness_checkins */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                This Week's Activity
              </h4>
              <div className="flex items-end justify-between gap-2 h-24 mb-2">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 flex-1">
                    <div className="relative w-full max-w-6">
                      <div
                        className="bg-primary rounded-t w-full transition-all duration-300"
                        style={{ height: `${day.workouts * 15 + 10}px` }}
                      />
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

            {/* Real counts only. The previous "Progress: 6/7 days — On Track!" block
                and the achievements list were hardcoded; there is no achievements
                backend, so nothing is claimed here that isn't measured. */}
            <div className="bg-wellness-gradient/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <h5 className="font-semibold">Last 7 days</h5>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {totalWorkouts} {totalWorkouts === 1 ? 'workout' : 'workouts'} completed
                </span>
                <Badge variant="outline">
                  {weeklyProgress.filter(d => d.mood > 0).length} check-ins
                </Badge>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressVisualization;