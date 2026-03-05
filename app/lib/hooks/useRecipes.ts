"use client";

import { useContext } from "react";
import { RecipeContext, RecipeContextType } from "../context";

export function useRecipes(): RecipeContextType {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within MealPlannerProvider");
  }
  return context;
}
