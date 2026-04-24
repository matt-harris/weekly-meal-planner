"use client";

import { Plus } from "lucide-react";
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

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");

    if (type === "recipe") {
      const recipe = getRecipeById(id);
      if (recipe) addMealToDay(day, recipe);
    } else if (type === "out") {
      addMealToDay(day, null, id as DayMeal["event"]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-h-96 flex-col overflow-hidden rounded-xl border-2 transition-all ${
        isToday
          ? "border-primary"
          : dragOver
            ? "border-primary/50 bg-primary/5"
            : "border-border bg-card"
      }`}
    >
      {/* Day header */}
      <div className={`px-4 pt-3 pb-2 ${isToday ? "bg-primary text-primary-foreground" : ""}`}>
        <h2 className={`text-lg font-bold ${isToday ? "text-primary-foreground" : "text-foreground"}`}>
          {dayName}
        </h2>
        {isToday && (
          <span className="mt-1 inline-block rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            Today
          </span>
        )}
      </div>

      {/* Meals area */}
      <div className={`flex flex-1 flex-col gap-2 p-3 ${isToday ? "bg-primary/5" : ""}`}>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}

        {meals.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-8 text-muted-foreground/40">
            <Plus size={20} strokeWidth={1.5} />
            <p className="text-xs">Drop meals</p>
          </div>
        )}
      </div>
    </div>
  );
}
