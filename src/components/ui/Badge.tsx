import { cn } from "@/lib/utils";

const variants = {
  default: "bg-surface-overlay text-text-secondary",
  brand: "bg-white/5 text-white border border-white/10",
  success: "bg-semantic-success/10 text-semantic-success",
  error: "bg-semantic-error/10 text-semantic-error",
  warning: "bg-semantic-warning/10 text-semantic-warning",
  info: "bg-semantic-info/10 text-semantic-info",
  pill: "bg-white/5 text-white border border-white/10",
  glow: "bg-white/5 text-white shadow-glow-sm",
  glass: "glass text-text-secondary border border-glass-border",
} as const;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Dot badge (with colored indicator)
interface DotBadgeProps extends BadgeProps {
  dotColor?: string;
}

export function DotBadge({ variant = "default", dotColor, className, children, ...props }: DotBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotColor || "bg-current")}
      />
      {children}
    </span>
  );
}

// Status badge with pulse animation
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'busy' | 'away';
}

const statusColors = {
  online: "bg-semantic-success",
  offline: "bg-text-muted",
  busy: "bg-semantic-error",
  away: "bg-semantic-warning",
};

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-surface-overlay text-text-secondary",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full animate-status-pulse",
          statusColors[status]
        )}
      />
      {children}
    </span>
  );
}
