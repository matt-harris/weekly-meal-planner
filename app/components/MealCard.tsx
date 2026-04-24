"use client";

import { X } from "lucide-react";
import { DayMeal } from "../lib/types";
import { useMealPlan } from "../lib/hooks/useMealPlan";

interface MealCardProps {
  meal: DayMeal;
}

export default function MealCard({ meal }: MealCardProps) {
  const { removeMealFromDay } = useMealPlan();

  return (
    <div className="group flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="min-w-0 flex-1">
        {meal.meal ? (
          <>
            {meal.meal.imageUrl && (
              <img
                src={meal.meal.imageUrl}
                alt=""
                className="mb-1.5 h-8 w-8 rounded object-cover"
              />
            )}
            <p className="truncate text-sm font-semibold text-foreground">
              {meal.meal.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {meal.meal.ingredients.length} ingredients
            </p>
          </>
        ) : meal.event ? (
          <p className="text-sm font-semibold text-amber-500">{meal.event} Out</p>
        ) : null}
      </div>
      <button
        onClick={() => removeMealFromDay(meal.id)}
        className="mt-0.5 flex-shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        title="Remove"
      >
        <X size={14} />
      </button>
    </div>
  );
}
