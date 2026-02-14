import { cn } from "@/lib/utils";

const variants = {
  default: "bg-surface-overlay text-text-secondary",
  brand: "bg-brand-500/10 text-brand-400",
  success: "bg-semantic-success/10 text-semantic-success",
  error: "bg-semantic-error/10 text-semantic-error",
  warning: "bg-semantic-warning/10 text-semantic-warning",
  info: "bg-semantic-info/10 text-semantic-info",
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
