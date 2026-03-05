"use client";

import { DayMeal } from "../lib/types";
import { useMealPlan } from "../lib/hooks/useMealPlan";

interface MealCardProps {
  meal: DayMeal;
}

export default function MealCard({ meal }: MealCardProps) {
  const { removeMealFromDay } = useMealPlan();

  const handleRemove = () => {
    removeMealFromDay(meal.id);
  };

  return (
    <div className="flex items-start justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-1">
        {meal.meal ? (
          <>
            <h4 className="font-medium text-black dark:text-white">
              {meal.meal.name}
            </h4>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {meal.meal.ingredients.length} ingredients
            </div>
          </>
        ) : meal.event ? (
          <h4 className="font-medium text-amber-600 dark:text-amber-500">
            {meal.event} Out
          </h4>
        ) : null}
      </div>
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
      >
        ✕
      </button>
    </div>
  );
}
