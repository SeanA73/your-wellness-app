import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  iconEmoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  iconEmoji,
  title,
  description,
  actionLabel,
  onAction,
  children,
  className = ''
}: EmptyStateProps) => {
  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          {Icon ? (
            <Icon className="w-8 h-8 text-muted-foreground" />
          ) : iconEmoji ? (
            <span className="text-4xl">{iconEmoji}</span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="default">
            {actionLabel}
          </Button>
        )}
        {children}
      </CardContent>
    </Card>
  );
};





