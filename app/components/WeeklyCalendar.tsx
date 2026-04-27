"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import DayColumn from "./DayColumn";
import { useMealPlan } from "../lib/hooks/useMealPlan";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_NAMES: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday",
  FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};

function getWeekLabel(isoMonday: string): string {
  const monday = new Date(isoMonday + "T00:00:00");
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(monday)} – ${fmt(sunday)} ${sunday.getFullYear()}`;
}

export default function WeeklyCalendar() {
  const { weekStart, isCurrentWeek, canGoPrev, canGoNext, goToPrevWeek, goToNextWeek, goToCurrentWeek, mealPlan } = useMealPlan();
  const daysPlanned = new Set(mealPlan.meals.map((m) => m.day)).size;

  const today = new Date();
  const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][today.getDay()];

  const monday = new Date(weekStart + "T00:00:00");
  function getDayDate(offset: number): string {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  const DAY_OFFSETS: Record<string, number> = {
    MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6,
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Week navigation */}
      <div className="flex items-center justify-between border-b border-border px-6 py-2">
        <button
          onClick={goToPrevWeek}
          disabled={!canGoPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{getWeekLabel(weekStart)}</span>
            {!isCurrentWeek && (
              <button
                onClick={goToCurrentWeek}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Go to Today
              </button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{daysPlanned} / 7 days planned</span>
        </div>

        <button
          onClick={goToNextWeek}
          disabled={!canGoNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next week"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="grid grid-cols-[repeat(7,minmax(160px,1fr))] gap-3">
          {DAYS.map((day) => (
            <DayColumn
              key={day}
              day={day}
              dayName={DAY_NAMES[day]}
              dateLabel={getDayDate(DAY_OFFSETS[day])}
              isToday={isCurrentWeek && day === todayDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
