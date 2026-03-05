"use client";

import { useMealPlan } from "../lib/hooks/useMealPlan";
import { useRecipes } from "../lib/hooks/useRecipes";
import { DayMeal } from "../lib/types";
import MealCard from "./MealCard";
import { useState } from "react";

interface DayColumnProps {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  dayName: string;
  isToday: boolean;
}

export default function DayColumn({ day, dayName, isToday }: DayColumnProps) {
  const { getMealsByDay, addMealToDay } = useMealPlan();
  const { getRecipeById } = useRecipes();
  const [dragOver, setDragOver] = useState(false);

  const meals = getMealsByDay(day);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");

    if (type === "recipe") {
      const recipe = getRecipeById(id);
      if (recipe) {
        addMealToDay(day, recipe);
      }
    } else if (type === "out") {
      const person = id;
      addMealToDay(day, null, person as any);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-96 flex flex-col rounded-lg border-2 border-dashed p-4 transition-colors ${
        isToday
          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
          : dragOver
            ? "border-blue-400 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
            : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-400">
          {day}
        </h3>
        <h2 className="text-lg font-bold text-black dark:text-white">
          {dayName}
        </h2>
        {isToday && (
          <span className="mt-1 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
            Today
          </span>
        )}
      </div>

      <div className="space-y-2 flex-1">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}
