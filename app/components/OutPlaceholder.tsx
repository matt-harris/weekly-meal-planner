"use client";

import { useState } from "react";
import { CalendarPlus, UtensilsCrossed } from "lucide-react";
import { Person } from "../lib/types";
import { useMealPlan } from "../lib/hooks/useMealPlan";
import DayPickerModal from "./DayPickerModal";

interface OutPlaceholderProps {
  person: Person;
}

export default function OutPlaceholder({ person }: OutPlaceholderProps) {
  const { addMealToDay } = useMealPlan();
  const [dayPickerOpen, setDayPickerOpen] = useState(false);

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData("type", "out");
          e.dataTransfer.setData("id", person);
        }}
        className="group flex cursor-move items-center justify-between rounded-lg border border-border bg-muted p-2.5 transition-colors hover:bg-accent"
      >
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={14} className="flex-shrink-0 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{person} Out</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setDayPickerOpen(true); }}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary md:opacity-0 md:group-hover:opacity-100"
          title="Add to day"
        >
          <CalendarPlus size={12} />
        </button>
      </div>

      {dayPickerOpen && (
        <DayPickerModal
          onSelect={(day) => addMealToDay(day, null, person)}
          onClose={() => setDayPickerOpen(false)}
        />
      )}
    </>
  );
}
