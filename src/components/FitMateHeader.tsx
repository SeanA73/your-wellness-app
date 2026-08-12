import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, Heart, User, LogOut, LogIn, Crown, Sparkles, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationCenter } from "@/components/NotificationCenter";

const FitMateHeader = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, actualTheme } = useTheme();

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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">FitMatePro</h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Your Personal Wellness Coach</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notifications */}
              <NotificationCenter />

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
                  <DropdownMenuItem onClick={() => navigate("/recommendations")}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Recommendations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/shop")}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/premium")}>
                    <Crown className="w-4 h-4 mr-2" />
                    Premium Features
                  </DropdownMenuItem>
                  {/* Admin Dashboard link removed: /admin route disabled pending admin RLS policies */}
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