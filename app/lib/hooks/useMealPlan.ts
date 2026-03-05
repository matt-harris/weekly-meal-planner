"use client";

import { useContext } from "react";
import { MealPlanContext, MealPlanContextType } from "../context";

export function useMealPlan(): MealPlanContextType {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error("useMealPlan must be used within MealPlannerProvider");
  }
  return context;
}
