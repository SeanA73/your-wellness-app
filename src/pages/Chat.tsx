import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Heart, Zap, Moon, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "fitmate",
      content: "Hi there! 👋 I'm FitMate Pro, your personal wellness coach. I'm here to help you with workouts, nutrition, mental wellness, and building healthy habits. How are you feeling today?",
      time: "Just now"
    }
  ]);

  const quickActions = [
    { icon: Heart, label: "Daily Check-in", color: "text-accent" },
    { icon: Zap, label: "Workout Plan", color: "text-primary" },
    { icon: Moon, label: "Sleep Tracking", color: "text-success" },
    { icon: Brain, label: "Mental Wellness", color: "text-wellness" },
    { icon: Target, label: "Goal Setting", color: "text-motivation" },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, {
      type: "user",
      content: message,
      time: "Just now"
    }]);
    
    // Simulate FitMate response
    setTimeout(() => {
      const responses = [
        "That's wonderful! I love your enthusiasm. Let's work together to make today amazing. What would you like to focus on first?",
        "I hear you! It's completely normal to have ups and downs. Remember, every small step counts. What's one thing we could do together right now to help you feel a bit better?",
        "Great question! Based on your progress, I think we should focus on building consistency rather than intensity. Small, sustainable changes lead to lasting results.",
        "I'm so proud of your dedication! You've been making incredible progress. Let's celebrate these wins and plan your next steps forward.",
        "That sounds challenging, but you're not alone in this. Let's break this down into smaller, manageable pieces. What feels most important to address first?"
      ];
      
      setMessages(prev => [...prev, {
        type: "fitmate", 
        content: responses[Math.floor(Math.random() * responses.length)],
        time: "Just now"
      }]);
    }, 1000);
    
    setMessage("");
  };

  const handleQuickAction = (action: string) => {
    setMessage(`Tell me about ${action.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Chat with FitMate Pro</h1>
              <p className="text-sm text-muted-foreground">Your personal wellness coach is here to help</p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success">
              Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col">
        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-wellness-gradient text-white' 
                  : 'bg-card border border-border'
              }`}>
                {msg.type === 'fitmate' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-success">FitMate Pro</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
                <span className={`text-xs mt-2 block ${
                  msg.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-3">
          <Input
            placeholder="Type your message to FitMate Pro..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} variant="wellness">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-calm-gradient rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Ask FitMate Pro about workouts, nutrition advice, goal setting, or just how you're feeling today. 
            I'm here to support your wellness journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;