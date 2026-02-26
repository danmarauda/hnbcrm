import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-white text-black font-semibold hover:bg-white/90 active:bg-white/80 focus:ring-white/50 shadow-glow-sm hover:shadow-glow",
  secondary: "bg-surface-overlay text-text-primary font-medium hover:bg-surface-raised active:bg-surface-sunken border border-border focus:ring-white/50",
  ghost: "bg-transparent text-white font-medium hover:bg-white/5 active:bg-white/10 focus:ring-white/50",
  dark: "bg-surface-raised text-white font-medium hover:bg-surface-overlay active:bg-surface-base border border-border focus:ring-white/50",
  danger: "bg-semantic-error text-white font-semibold hover:bg-red-600 active:bg-red-700 focus:ring-semantic-error",
  glass: "glass text-text-primary font-medium hover:bg-glass-bg-hover border border-glass-border hover:border-glass-border-hover focus:ring-white/50",
} as const;

const sizes = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asMotion?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, asMotion = false, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-full transition-all duration-150",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      variants[variant],
      sizes[size],
      className
    );

    if (asMotion) {
      const motionProps = props as unknown as HTMLMotionProps<"button">;
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          {...motionProps}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={baseClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icon button variant
interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label: string; // Required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", label, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
