import { motion } from "framer-motion";

interface OrbProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "white" | "brand";
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: "w-48 h-48",
  md: "w-72 h-72",
  lg: "w-96 h-96",
  xl: "w-[500px] h-[500px]",
};

const variants = {
  white: "bg-gradient-radial from-white/10 to-transparent",
  brand: "bg-gradient-radial from-white/15 to-transparent",
};

const orbVariants = {
  animate: {
    y: [-20, 20, -20],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export function Orb({ size = "lg", variant = "white", className, animate = true }: OrbProps) {
  const Component = animate ? motion.div : "div";

  return (
    <Component
      {...(animate && { variants: orbVariants, animate: "animate" })}
      className={`
        absolute rounded-full blur-[80px] opacity-30 pointer-events-none
        ${sizes[size]}
        ${variant === "white"
          ? "bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)]"
          : "bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)]"
        }
        ${className}
      `}
    />
  );
}

// Grid overlay
export function GridOverlay({ className }: { className?: string }) {
  return (
    <div
      className={`
        absolute inset-0 pointer-events-none
        bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
        bg-[size:60px_60px]
        ${className}
      `}
    />
  );
}

// Paper texture
export function PaperTexture({ className }: { className?: string }) {
  return (
    <div
      className={`
        absolute inset-0 pointer-events-none
        bg-[url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")]
        opacity-[0.02]
        ${className}
      `}
    />
  );
}
