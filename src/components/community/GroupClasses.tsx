import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  Star, 
  Lock,
  Crown,
  Zap
} from 'lucide-react';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface GroupClass {
  id: string;
  title: string;
  instructor: string;
  type: 'yoga' | 'hiit' | 'strength' | 'cardio' | 'meditation';
  date: string;
  time: string;
  duration: number;
  participants: number;
  maxParticipants: number;
  isPremium: boolean;
  rating: number;
  description: string;
}

export const GroupClasses = () => {
  const { hasPremiumAccess } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingClasses: GroupClass[] = [
    {
      id: '1',
      title: 'Morning Power Yoga',
      instructor: 'Sarah Johnson',
      type: 'yoga',
      date: '2024-01-15',
      time: '07:00',
      duration: 45,
      participants: 24,
      maxParticipants: 50,
      isPremium: true,
      rating: 4.9,
      description: 'Start your day with an energizing yoga flow'
    },
    {
      id: '2',
      title: 'HIIT Blast Session',
      instructor: 'Mike Chen',
      type: 'hiit',
      date: '2024-01-15',
      time: '18:00',
      duration: 30,
      participants: 18,
      maxParticipants: 30,
      isPremium: true,
      rating: 4.8,
      description: 'High-intensity interval training for maximum results'
    },
    {
      id: '3',
      title: 'Strength Training Basics',
      instructor: 'Emily Davis',
      type: 'strength',
      date: '2024-01-16',
      time: '19:00',
      duration: 60,
      participants: 12,
      maxParticipants: 25,
      isPremium: false,
      rating: 4.7,
      description: 'Perfect for beginners looking to build muscle'
    },
  ];

  const handleJoinClass = (classId: string, isPremium: boolean) => {
    if (isPremium && !hasPremiumAccess()) {
      toast({
        title: "Premium Feature",
        description: "This is a premium class. Upgrade to join priority classes.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Class Joined!",
      description: "You've successfully joined the class. See you there!",
    });
  };

  const getClassTypeIcon = (type: string) => {
    switch (type) {
      case 'yoga': return '🧘';
      case 'hiit': return '⚡';
      case 'strength': return '💪';
      case 'cardio': return '🏃';
      case 'meditation': return '🧘‍♀️';
      default: return '🏋️';
    }
  };

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case 'yoga': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'hiit': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'strength': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'cardio': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Group Classes
              {hasPremiumAccess() && (
                <Badge variant="default" className="ml-2">
                  <Crown className="w-3 h-3 mr-1" />
                  Priority Access
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Join live group fitness classes with certified instructors
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
            <TabsTrigger value="past">Past Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingClasses.map((classItem) => (
              <Card key={classItem.id} className={classItem.isPremium ? 'border-primary/50' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{classItem.title}</CardTitle>
                        {classItem.isPremium && (
                          <Badge variant="default" className="gap-1">
                            <Crown className="w-3 h-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mb-2">
                        {classItem.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classItem.participants}/{classItem.maxParticipants}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {classItem.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.duration} min
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getClassTypeColor(classItem.type)} text-xs px-2 py-1`}>
                      {getClassTypeIcon(classItem.type)} {classItem.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(classItem.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {classItem.time} • {classItem.instructor}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinClass(classItem.id, classItem.isPremium)}
                      disabled={classItem.isPremium && !hasPremiumAccess()}
                      className="gap-2"
                    >
                      <Video className="w-4 h-4" />
                      {classItem.isPremium && !hasPremiumAccess() ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Premium
                        </>
                      ) : (
                        'Join Class'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-4">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Past Classes</h3>
              <p className="text-muted-foreground">
                Your completed classes will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {!hasPremiumAccess() && (
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Unlock Priority Access</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Premium members get early access to all classes and exclusive premium sessions.
                </p>
                <UpgradePrompt 
                  trigger="premium_feature_access"
                  featureName="Priority Group Classes"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


