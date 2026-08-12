import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Zap, Moon, Droplets, LogIn, User, Plus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWellnessCheckIn } from "@/hooks/useWellnessCheckIn";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";

const DailyCheckIn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { todayCheckIn, loading, submitCheckIn, getStreak } = useWellnessCheckIn();
  const [streak, setStreak] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    mood_rating: 5,
    energy_level: 5,
    stress_level: 5,
    sleep_quality: 5,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      getStreak().then(setStreak);
    }
  }, [user, todayCheckIn]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitCheckIn(formData);
      setDialogOpen(false);
      setFormData({
        mood_rating: 5,
        energy_level: 5,
        stress_level: 5,
        sleep_quality: 5,
        notes: "",
      });
    } catch (error) {
      console.error('Error submitting check-in:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Show different content based on authentication status
  if (!user) {
    return (
      <Card className="shadow-card hover:shadow-card-hover transition-smooth">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <User className="w-5 h-5" />
              Daily Check-In
            </CardTitle>
            <Button variant="wellness" size="sm" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Track Your Daily Wellness</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to log your daily energy, mood, sleep quality, and hydration. 
              Get personalized insights from FitMatePro to optimize your wellness journey.
            </p>
            <Button variant="wellness" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Start Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = todayCheckIn ? [
    { icon: Heart, label: "Mood", value: todayCheckIn.mood_rating, max: 10, color: "text-accent" },
    { icon: Zap, label: "Energy", value: todayCheckIn.energy_level, max: 10, color: "text-primary" },
    { icon: Moon, label: "Sleep Quality", value: todayCheckIn.sleep_quality, max: 10, color: "text-success" },
    { icon: Droplets, label: "Stress Level", value: todayCheckIn.stress_level, max: 10, color: "text-primary" },
  ] : [];

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Daily Check-In</CardTitle>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {streak} day streak
              </Badge>
            )}
            {todayCheckIn ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Checked in
              </Badge>
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="wellness" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Check In
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Daily Wellness Check-In</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label>Mood Rating: {formData.mood_rating}/10</Label>
                      <Slider
                        value={[formData.mood_rating]}
                        onValueChange={(value) => setFormData({...formData, mood_rating: value[0]})}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Energy Level: {formData.energy_level}/10</Label>
                      <Slider
                        value={[formData.energy_level]}
                        onValueChange={(value) => setFormData({...formData, energy_level: value[0]})}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sleep Quality: {formData.sleep_quality}/10</Label>
                      <Slider
                        value={[formData.sleep_quality]}
                        onValueChange={(value) => setFormData({...formData, sleep_quality: value[0]})}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stress Level: {formData.stress_level}/10</Label>
                      <Slider
                        value={[formData.stress_level]}
                        onValueChange={(value) => setFormData({...formData, stress_level: value[0]})}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="How are you feeling today?"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                      {submitting ? "Saving..." : "Save Check-In"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {todayCheckIn ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{stat.value}/10</span>
                    </div>
                    <Progress 
                      value={(stat.value / stat.max) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
            {todayCheckIn.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{todayCheckIn.notes}</p>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            iconEmoji="📝"
            title="No check-in today"
            description="Start tracking your wellness by completing your daily check-in."
            actionLabel="Check In Now"
            onAction={() => setDialogOpen(true)}
          />
        )}
        
        <div className="bg-calm-gradient rounded-lg p-4">
          <h4 className="font-semibold mb-2">FitMatePro's Insight</h4>
          <p className="text-sm text-muted-foreground mb-3">
            {todayCheckIn 
              ? "Keep up the great work! Regular check-ins help you understand patterns in your wellness."
              : "Start your day with intention! Daily check-ins help you understand patterns in your energy, sleep, and mood."
            }
          </p>
          <Button variant="calm" size="sm" onClick={() => navigate("/chat")}>
            Get personalized advice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;
