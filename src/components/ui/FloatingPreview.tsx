import { useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface FloatingPreviewProps {
  activeItem: { image: string; title: string } | null;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 200, height: 112 },
  md: { width: 280, height: 158 },
  lg: { width: 360, height: 203 },
};

export function FloatingPreview({ activeItem, size = "md" }: FloatingPreviewProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - sizes[size].width / 2);
      mouseY.set(e.clientY - sizes[size].height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, size]);

  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          style={{ x, y }}
          className="fixed pointer-events-none z-[100] overflow-hidden rounded-lg shadow-2xl"
        >
          <div className="glass glass-lg rounded-lg overflow-hidden border border-glass-border">
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="w-full h-full object-cover"
              style={{ width: sizes[size].width, height: sizes[size].height }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
