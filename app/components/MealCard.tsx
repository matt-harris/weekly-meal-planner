"use client";

import { useState, useRef } from "react";
import { UtensilsCrossed, X } from "lucide-react";
import { DayMeal } from "../lib/types";
import { useMealPlan } from "../lib/hooks/useMealPlan";
import { useToast } from "./ToastProvider";
import RecipeDetailModal from "./RecipeDetailModal";

interface MealCardProps {
  meal: DayMeal;
}

export default function MealCard({ meal }: MealCardProps) {
  const { removeMealFromDay, reorderMeals, addMealToDay } = useMealPlan();
  const { showUndo } = useToast();
  const [detailOpen, setDetailOpen] = useState(false);
  const [dropPos, setDropPos] = useState<"top" | "bottom" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleDragStart(e: React.DragEvent) {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("type", "reorder");
    e.dataTransfer.setData("id", meal.id);
  }

  function handleDragOver(e: React.DragEvent) {
    if (e.dataTransfer.types.includes("text/plain") || !cardRef.current) return;
    // Only handle reorder drags
    e.preventDefault();
    e.stopPropagation();
    const rect = cardRef.current.getBoundingClientRect();
    setDropPos(e.clientY < rect.top + rect.height / 2 ? "top" : "bottom");
  }

  function handleDragLeave() {
    setDropPos(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData("type");
    if (type !== "reorder") { setDropPos(null); return; }
    const draggedId = e.dataTransfer.getData("id");
    if (draggedId && draggedId !== meal.id) {
      reorderMeals(meal.day, draggedId, meal.id, dropPos === "top");
    }
    setDropPos(null);
  }

  return (
    <>
      <div
        ref={cardRef}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={() => setDropPos(null)}
        onClick={() => meal.meal && setDetailOpen(true)}
        className={[
          "group flex items-start justify-between gap-2 rounded-lg border bg-card p-2.5 shadow-sm transition-all hover:shadow-md",
          meal.meal ? "cursor-pointer" : "",
          dropPos === "top" ? "border-primary border-t-2" : dropPos === "bottom" ? "border-primary border-b-2" : "border-border",
        ].join(" ")}
      >
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
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={14} className="flex-shrink-0 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">{meal.event} Out</p>
            </div>
          ) : null}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const snapshot = meal;
            removeMealFromDay(meal.id);
            const label = meal.meal ? `"${meal.meal.name}" removed` : `"${meal.event} Out" removed`;
            showUndo(label, () => addMealToDay(snapshot.day, snapshot.meal ?? null, snapshot.event));
          }}
          className="mt-0.5 flex-shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          title="Remove"
        >
          <X size={14} />
        </button>
      </div>

      {detailOpen && meal.meal && (
        <RecipeDetailModal recipe={meal.meal} onClose={() => setDetailOpen(false)} />
      )}
    </>
  );
}
