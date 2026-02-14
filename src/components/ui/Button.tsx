import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-600 text-white font-semibold hover:bg-brand-700 active:bg-brand-800 focus:ring-brand-500",
  secondary: "bg-surface-overlay text-text-primary font-medium hover:bg-surface-raised active:bg-surface-sunken border border-border focus:ring-brand-500",
  ghost: "bg-transparent text-brand-500 font-medium hover:bg-brand-500/10 active:bg-brand-500/20 focus:ring-brand-500",
  dark: "bg-surface-raised text-brand-400 font-medium hover:bg-surface-overlay active:bg-surface-base border border-border focus:ring-brand-500",
  danger: "bg-semantic-error text-white font-semibold hover:bg-red-600 active:bg-red-700 focus:ring-semantic-error",
} as const;

const sizes = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
