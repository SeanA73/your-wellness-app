import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Settings, Heart, User, LogOut, LogIn, ShoppingBag, Dumbbell, Apple, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const FitMateHeader = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-wellness-gradient rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">FitMate Pro</h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Your Personal Wellness Coach</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/workouts")}>
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Workouts
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/nutrition")}>
                  <Apple className="w-4 h-4 mr-2" />
                  Nutrition
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/chat")}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  AI Coach
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate("/shop")} className="bg-gradient-to-r from-primary to-accent">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop
                </Button>
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2">Notifications</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'FM'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="wellness" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default FitMateHeader;