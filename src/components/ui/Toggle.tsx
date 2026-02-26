import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  variant?: "default" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
  md: { track: "w-10 h-5", thumb: "w-4 h-4", translate: "translate-x-5" },
  lg: { track: "w-12 h-6", thumb: "w-5 h-5", translate: "translate-x-6" },
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, label, disabled, variant = "default", size = "md", className }, ref) => {
    const sizeConfig = sizes[size];

    const trackClasses = cn(
      "relative rounded-full transition-all duration-200",
      sizeConfig.track,
      variant === "glass"
        ? checked
          ? "bg-white/10 border border-white/20"
          : "glass border border-glass-border"
        : checked
        ? "bg-white"
        : "bg-surface-overlay border border-border",
      disabled && "opacity-50 cursor-not-allowed"
    );

    const thumbClasses = cn(
      "absolute top-0.5 left-0.5 rounded-full transition-all duration-200",
      sizeConfig.thumb,
      variant === "glass" ? "bg-white/80" : "bg-surface-base",
      checked && sizeConfig.translate,
      disabled && "opacity-50"
    );

    const handleClick = () => {
      if (!disabled) {
        onChange?.(!checked);
      }
    };

    return (
      <label className={cn("flex items-center gap-3", disabled && "cursor-not-allowed", className)}>
        <motion.button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleClick}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          className={trackClasses}
        >
          <motion.div
            className={thumbClasses}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
        {label && <span className={cn("text-sm", disabled ? "text-text-muted" : "text-text-primary")}>{label}</span>}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
