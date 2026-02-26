import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  variant?: "default" | "glass";
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, onChange, label, disabled, variant = "default", className }, ref) => {
    const baseClasses = cn(
      "w-5 h-5 rounded flex items-center justify-center transition-all duration-200 shrink-0",
      variant === "glass" ? "glass border border-glass-border" : "border-2 border-border bg-surface-raised",
      !disabled && "cursor-pointer",
      disabled && "opacity-50 cursor-not-allowed"
    );

    const checkedClasses = checked
      ? variant === "glass"
        ? "bg-white/10 border-white/20"
        : "bg-white border-white"
      : "";

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
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleClick}
          whileTap={!disabled ? { scale: 0.9 } : undefined}
          className={cn(baseClasses, checkedClasses)}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check size={12} strokeWidth={3} className={variant === "glass" ? "text-white" : "text-black"} />
            </motion.div>
          )}
        </motion.button>
        {label && <span className={cn("text-sm", disabled ? "text-text-muted" : "text-text-primary")}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
