"use client";

import DayColumn from "./DayColumn";
import { Person } from "@/lib/types";

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
  const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
    today.getDay()
  ];

  return (
    <div className="flex-1 overflow-x-auto bg-gray-50 p-6 dark:bg-gray-950">
      <div className="grid grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <DayColumn
            key={day}
            day={day as typeof DAYS[number]}
            dayName={DAY_NAMES[day]}
            isToday={day === todayDay}
          />
        ))}
      </div>
    </div>
  );
}
