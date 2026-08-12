import { useTheme, type ThemeColor } from '@/contexts/ThemeContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Moon, Sun, Monitor, Palette, Lock } from 'lucide-react';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';

export const ThemeSettings = () => {
  const { theme, themeColor, setTheme, setThemeColor, actualTheme } = useTheme();
  const { hasPremiumAccess } = useSubscription();

  if (!hasPremiumAccess()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Themes & Appearance
          </CardTitle>
          <CardDescription>
            Premium feature: Customize your app's appearance with themes and color schemes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpgradePrompt 
            trigger="premium_feature_access"
            featureName="Dark Mode & Themes"
          />
        </CardContent>
      </Card>
    );
  }

  const themeColors = [
    { value: 'blue', label: 'Ocean Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Forest Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Royal Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Sunset Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Cherry Red', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance Settings
          </CardTitle>
          <CardDescription>
            Customize how FitMatePro looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme Mode</Label>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Monitor className="w-4 h-4" />
                  <span>System</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    ({actualTheme === 'dark' ? 'Dark' : 'Light'})
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Theme Color */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Color Scheme</Label>
            <div className="grid grid-cols-5 gap-3">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setThemeColor(color.value as 'blue' | 'green' | 'purple' | 'orange' | 'red')}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    themeColor === color.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`${color.color} w-full h-12 rounded mb-2`} />
                  <div className="text-xs font-medium text-center">{color.label}</div>
                  {themeColor === color.value && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
