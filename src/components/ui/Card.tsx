import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { glassHover } from "@/lib/animations";

const variants = {
  default: "bg-surface-raised shadow-card",
  sunken: "bg-surface-sunken shadow-none",
  interactive: "bg-surface-raised shadow-card hover:shadow-card-hover hover:bg-surface-overlay transition-all duration-150 cursor-pointer",
  glass: "glass glass-hover transition-all duration-200",
  bento: "bento-glow transition-all duration-200",
  bentoBrand: "bento-glow bento-glow-brand transition-all duration-200",
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  asMotion?: boolean;
}

/**
 * Card component with multiple visual variants.
 *
 * - default: Standard raised card
 * - sunken: Inset appearance
 * - interactive: Hover effects for clickable cards
 * - glass: Frosted glass with backdrop blur
 * - bento: Glass with inset glow (for bento grid layouts)
 * - bentoBrand: Bento with white glow on hover
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, children, asMotion = false, ...props }, ref) => {
    const baseClasses = cn(
      "rounded-card border border-border p-4 md:p-6",
      variants[variant],
      className
    );

    if (asMotion) {
      const motionProps = props as HTMLMotionProps<"div">;
      return (
        <motion.div
          ref={ref}
          className={baseClasses}
          initial="rest"
          whileHover="hover"
          variants={variant === "glass" ? glassHover : undefined}
          {...motionProps}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Smaller card variant for compact displays
export const CardCompact = forwardRef<HTMLDivElement, Omit<CardProps, 'className'> & { className?: string }>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-field border border-border p-3",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardCompact.displayName = "CardCompact";

// Stat card for dashboard metrics
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ icon: Icon, label, value, change, trend = 'neutral', className }: StatCardProps) {
  return (
    <Card variant="bento" className={cn("p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl glass flex items-center justify-center shrink-0">
          <Icon size={18} className="text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary truncate">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tabular-nums text-text-primary">{value}</p>
            {change && (
              <span className={cn(
                "text-xs font-medium",
                trend === 'up' && "text-semantic-success",
                trend === 'down' && "text-semantic-error",
                trend === 'neutral' && "text-text-muted"
              )}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
