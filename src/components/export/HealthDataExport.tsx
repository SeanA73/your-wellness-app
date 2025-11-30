import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Database, Lock, Calendar } from 'lucide-react';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportOptions {
  workouts: boolean;
  nutrition: boolean;
  wellness: boolean;
  progress: boolean;
  goals: boolean;
  all: boolean;
}

export const HealthDataExport = () => {
  const { hasPremiumAccess } = useSubscription();
  const { toast } = useToast();
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'year'>('all');
  const [options, setOptions] = useState<ExportOptions>({
    workouts: true,
    nutrition: true,
    wellness: true,
    progress: true,
    goals: true,
    all: true
  });

  const handleOptionChange = (key: keyof ExportOptions, value: boolean) => {
    if (key === 'all') {
      setOptions({
        workouts: value,
        nutrition: value,
        wellness: value,
        progress: value,
        goals: value,
        all: value
      });
    } else {
      const newOptions = { ...options, [key]: value };
      newOptions.all = Object.keys(newOptions).filter(k => k !== 'all').every(k => newOptions[k as keyof ExportOptions]);
      setOptions(newOptions);
    }
  };

  const handleExport = async () => {
    const selectedData = Object.keys(options).filter(key => key !== 'all' && options[key as keyof ExportOptions]);
    
    if (selectedData.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one data type to export",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Exporting Data",
      description: `Preparing your ${format.toUpperCase()} export...`,
    });

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete!",
        description: "Your data export will download shortly.",
      });
      // In real implementation, trigger actual file download
    }, 2000);
  };

  if (!hasPremiumAccess()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Health Data
            <Badge variant="secondary" className="ml-2">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Download your complete health and fitness data in multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpgradePrompt 
            trigger="premium_feature_access"
            featureName="Health Data Export"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Export Health Data
          <Badge variant="default" className="ml-2">Premium</Badge>
        </CardTitle>
        <CardDescription>
          Export your fitness journey data for backup, analysis, or transfer
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Export Format</Label>
          <Select value={format} onValueChange={(value: 'json' | 'csv' | 'pdf') => setFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  JSON (Complete Data)
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  CSV (Spreadsheet)
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF (Report)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Date Range</Label>
          <Select value={dateRange} onValueChange={(value: 'all' | 'month' | 'year') => setDateRange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select Data to Export</Label>
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="export-all"
                checked={options.all}
                onCheckedChange={(checked) => handleOptionChange('all', checked as boolean)}
              />
              <Label htmlFor="export-all" className="font-semibold cursor-pointer flex-1">
                Select All
              </Label>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-workouts"
                  checked={options.workouts}
                  onCheckedChange={(checked) => handleOptionChange('workouts', checked as boolean)}
                />
                <Label htmlFor="export-workouts" className="cursor-pointer flex-1">
                  Workouts & Exercises
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-nutrition"
                  checked={options.nutrition}
                  onCheckedChange={(checked) => handleOptionChange('nutrition', checked as boolean)}
                />
                <Label htmlFor="export-nutrition" className="cursor-pointer flex-1">
                  Nutrition Logs
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-wellness"
                  checked={options.wellness}
                  onCheckedChange={(checked) => handleOptionChange('wellness', checked as boolean)}
                />
                <Label htmlFor="export-wellness" className="cursor-pointer flex-1">
                  Wellness Check-ins
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-progress"
                  checked={options.progress}
                  onCheckedChange={(checked) => handleOptionChange('progress', checked as boolean)}
                />
                <Label htmlFor="export-progress" className="cursor-pointer flex-1">
                  Progress Metrics
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-goals"
                  checked={options.goals}
                  onCheckedChange={(checked) => handleOptionChange('goals', checked as boolean)}
                />
                <Label htmlFor="export-goals" className="cursor-pointer flex-1">
                  Goals & Targets
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> Your data export includes all selected information from the specified date range. 
            JSON format includes complete data, CSV is optimized for spreadsheets, and PDF provides a formatted report.
          </p>
        </div>

        {/* Export Button */}
        <Button onClick={handleExport} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export Health Data
        </Button>
      </CardContent>
    </Card>
  );
};


