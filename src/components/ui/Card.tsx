import { cn } from "@/lib/utils";

const variants = {
  default: "bg-surface-raised shadow-card",
  sunken: "bg-surface-sunken shadow-none",
  interactive: "bg-surface-raised shadow-card hover:shadow-card-hover hover:bg-surface-overlay transition-all duration-150 cursor-pointer",
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border p-4 md:p-6",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
