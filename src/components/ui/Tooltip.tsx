import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function Tooltip({ content, children, position = "top", delay = 200, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const animationVariants = {
    top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={animationVariants[position].initial}
            animate={animationVariants[position].animate}
            exit={animationVariants[position].initial}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap",
              "glass border border-glass-border text-text-primary",
              positionClasses[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
