"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMealPlan } from "../lib/hooks/useMealPlan";
import { DayMeal } from "../lib/types";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_NAMES: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
  THU: "Thursday", FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};
const DAY_OFFSETS: Record<string, number> = {
  MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6,
};

interface DayPickerModalProps {
  onSelect: (day: DayMeal["day"]) => void;
  onClose: () => void;
}

export default function DayPickerModal({ onSelect, onClose }: DayPickerModalProps) {
  const { weekStart, mealPlan, isCurrentWeek } = useMealPlan();
  const monday = new Date(weekStart + "T00:00:00");
  const today = new Date();
  const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][today.getDay()];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function getDayDate(offset: number): string {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-xl border border-border bg-card p-5 shadow-xl animate-modal-in sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-foreground">Add to day</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DAYS.map((day) => {
            const count = mealPlan.meals.filter((m) => m.day === day).length;
            const isToday = isCurrentWeek && day === todayDay;
            return (
              <button
                key={day}
                onClick={() => { onSelect(day); onClose(); }}
                className={`flex flex-col rounded-lg border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5 ${
                  isToday ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <span className="text-sm font-semibold text-foreground">{DAY_NAMES[day]}</span>
                <span className="text-xs text-muted-foreground">{getDayDate(DAY_OFFSETS[day])}</span>
                {count > 0 && (
                  <span className="mt-1 text-xs text-primary">
                    {count} meal{count !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
