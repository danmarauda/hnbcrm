import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  contentClassName?: string;
}

export function Popover({ trigger, children, position = "bottom", className, contentClassName }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getPositionStyles = () => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;

    switch (position) {
      case "top":
        return {
          bottom: window.innerHeight - rect.top + gap,
          left: rect.left + rect.width / 2,
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          top: rect.bottom + gap,
          left: rect.left + rect.width / 2,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + gap,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + gap,
          transform: "translateY(-50%)",
        };
      default:
        return {};
    }
  };

  const animationVariants = {
    top: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } },
    bottom: { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
    left: { initial: { opacity: 0, x: 8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 8 } },
    right: { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -8 } },
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={animationVariants[position].initial}
              animate={animationVariants[position].animate}
              exit={animationVariants[position].exit}
              transition={{ duration: 0.15 }}
              style={{ position: "fixed", ...getPositionStyles() }}
              className={cn(
                "z-50 min-w-[180px] rounded-lg glass glass-lg border border-glass-border p-1",
                contentClassName
              )}
            >
              {typeof children === "function" ? (children as (close: () => void) => React.ReactNode)(() => setIsOpen(false)) : children}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

// Popover Menu Item
export function PopoverItem({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        disabled
          ? "text-text-muted cursor-not-allowed"
          : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
      )}
    >
      {children}
    </button>
  );
}

// Popover Divider
export function PopoverDivider() {
  return <div className="my-1 border-t border-glass-border" />;
}
