import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

export function GlassModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  className,
}: GlassModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "relative w-full glass glass-lg rounded-2xl border border-glass-border overflow-hidden",
              sizes[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            {(title || subtitle) && (
              <div className="px-6 pt-6 pb-4 border-b border-glass-border">
                {subtitle && (
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{subtitle}</p>
                )}
                {title && (
                  <h2 className="font-display text-2xl text-text-primary tracking-wide uppercase">{title}</h2>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto glass-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
