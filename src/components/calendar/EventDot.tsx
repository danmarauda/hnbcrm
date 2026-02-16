import { cn } from "@/lib/utils";
import { EVENT_TYPE_COLORS } from "./constants";

interface EventDotProps {
  eventType: string;
  isTask?: boolean;
  title: string;
}

export function EventDot({ eventType, isTask, title }: EventDotProps) {
  const colors = EVENT_TYPE_COLORS[eventType] || EVENT_TYPE_COLORS.other;

  return (
    <div
      className={cn(
        "h-1.5 w-full rounded-full",
        colors.bg,
        isTask ? "border border-dashed" : colors.border
      )}
      title={title}
    />
  );
}
