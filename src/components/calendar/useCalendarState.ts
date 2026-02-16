import { useState, useMemo } from "react";

type CalendarView = "month" | "week" | "day";

export function useCalendarState() {
  const [view, setView] = useState<CalendarView>("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (view === "month") {
      // Get first day of month, then go back to start of week (Monday)
      start.setDate(1);
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday is 0
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);

      // Get last day of month, then go forward to end of week (Sunday)
      end.setMonth(end.getMonth() + 1, 0); // Last day of current month
      const lastDayOfWeek = end.getDay();
      const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      end.setDate(end.getDate() + daysToAdd);
      end.setHours(23, 59, 59, 999);
    } else if (view === "week") {
      // Get Monday of current week
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);

      // Get Sunday of current week
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      // Day view
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    return { startDate: start.getTime(), endDate: end.getTime() };
  }, [currentDate, view]);

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectDay = (date: Date) => {
    setCurrentDate(date);
    setView("day");
  };

  return {
    view,
    setView,
    currentDate,
    dateRange,
    navigatePrev,
    navigateNext,
    goToToday,
    selectDay,
  };
}
