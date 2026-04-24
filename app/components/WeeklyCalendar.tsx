"use client";

import DayColumn from "./DayColumn";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_NAMES: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export default function WeeklyCalendar() {
  const today = new Date();
  const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][today.getDay()];

  return (
    <div className="flex-1 overflow-x-auto bg-background p-6">
      <div className="grid min-w-[700px] grid-cols-7 gap-3">
        {DAYS.map((day) => (
          <DayColumn
            key={day}
            day={day}
            dayName={DAY_NAMES[day]}
            isToday={day === todayDay}
          />
        ))}
      </div>
    </div>
  );
}
