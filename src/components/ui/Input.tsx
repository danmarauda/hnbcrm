import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-surface-raised border border-border-strong rounded-field",
              "px-3.5 py-2.5 text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-colors duration-150",
              "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-[13px] text-semantic-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
