import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "card";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        variant === "text" && "h-4 rounded-field",
        variant === "circle" && "h-10 w-10 rounded-full",
        variant === "card" && "h-32 rounded-card",
        className
      )}
      aria-hidden="true"
    />
  );
}
