import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Zap, Moon, Droplets } from "lucide-react";

const DailyCheckIn = () => {
  const todayStats = [
    { icon: Heart, label: "Energy Level", value: 7, max: 10, color: "text-accent" },
    { icon: Zap, label: "Motivation", value: 8, max: 10, color: "text-primary" },
    { icon: Moon, label: "Sleep Quality", value: 6, max: 10, color: "text-success" },
    { icon: Droplets, label: "Hydration", value: 1200, max: 2000, color: "text-primary", unit: "ml" },
  ];

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Daily Check-In</CardTitle>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Day 12
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {todayStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stat.value}{stat.unit || ''}</span>
                  <span>{stat.max}{stat.unit || ''}</span>
                </div>
                <Progress 
                  value={(stat.value / stat.max) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-calm-gradient rounded-lg p-4">
          <h4 className="font-semibold mb-2">FitMate's Insight</h4>
          <p className="text-sm text-muted-foreground mb-3">
            "Your energy is good today, but I notice your sleep could use some attention. 
            How about we try a gentle 20-minute yoga session to help you unwind later?"
          </p>
          <Button variant="calm" size="sm">
            Tell me more
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;