import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export type StatusType =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'active'
  | 'inactive'
  | 'drifted'
  | 'stable';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

const statusMap: Record<
  StatusType,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pending: { label: 'Pending', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  completed: { label: 'Completed', variant: 'default' },
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  drifted: { label: 'Drifted', variant: 'destructive' },
  stable: { label: 'Stable', variant: 'default' },
};

export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = statusMap[status] || { label: status, variant: 'outline' };

  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {showIcon && status === 'stable' && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {showIcon && status === 'drifted' && <AlertTriangle className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

/** Environment status indicator with dot + text pattern */
export function EnvironmentStatus({ status }: { status: 'stable' | 'drifted' }) {
  if (status === 'stable') {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
        <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
        <span>In sync with Git</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
      <AlertTriangle className="h-4 w-4" />
      <span>Drift detected</span>
    </div>
  );
}
