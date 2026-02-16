import { useMemo } from "react";
import { DayCell } from "./DayCell";
import { WEEKDAYS_SHORT } from "./constants";

interface MonthViewEvent {
  _id: string;
  title: string;
  startTime: string;
  eventType: string;
  _source?: "event" | "task";
}

interface MonthViewProps {
  currentDate: Date;
  events: MonthViewEvent[];
  onEventClick: (eventId: string) => void;
  onSelectDay: (date: Date) => void;
}

export function MonthView({ currentDate, events, onSelectDay }: MonthViewProps) {
  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Start from Monday
    const startDate = new Date(firstDay);
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    startDate.setDate(startDate.getDate() - offset);

    // Generate 6 weeks (42 days)
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }

    return days;
  }, [currentDate]);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, MonthViewEvent[]>();

    calendarDays.forEach((day) => {
      const key = day.toDateString();
      grouped.set(key, []);
    });

    events.forEach((event) => {
      const eventDate = new Date(event.startTime);
      const key = eventDate.toDateString();
      const existing = grouped.get(key);
      if (existing) {
        existing.push(event);
      }
    });

    return grouped;
  }, [calendarDays, events]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-surface-raised">
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={day}
            className="text-center py-2 text-xs font-medium text-text-muted border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 overflow-auto">
        {calendarDays.map((day) => (
          <DayCell
            key={day.toISOString()}
            date={day}
            events={eventsByDay.get(day.toDateString()) || []}
            isToday={isToday(day)}
            isCurrentMonth={isCurrentMonth(day)}
            onSelectDay={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
}
