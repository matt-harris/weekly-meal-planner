"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Recipe, WeeklyPlan, DayMeal, Person } from "./types";

/**
 * RecipeContext & MealPlanContext
 * Manages app state with localStorage persistence
 */

// ============ Recipe Context ============
export interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// ============ MealPlan Context ============
export interface MealPlanContextType {
  mealPlan: WeeklyPlan;
  addMealToDay: (day: DayMeal["day"], meal: Recipe | null, event?: Person) => void;
  removeMealFromDay: (id: string) => void;
  getMealsByDay: (day: DayMeal["day"]) => DayMeal[];
  clearAll: () => void;
}

export const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// ============ Provider Component ============
interface MealPlannerProviderProps {
  children: ReactNode;
}

export function MealPlannerProvider({ children }: MealPlannerProviderProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<WeeklyPlan>({ meals: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem("meal-planner-recipes");
    const savedMealPlan = localStorage.getItem("meal-planner-mealplan");

    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (e) {
        console.error("Failed to load recipes from localStorage", e);
      }
    }

    if (savedMealPlan) {
      try {
        setMealPlan(JSON.parse(savedMealPlan));
      } catch (e) {
        console.error("Failed to load meal plan from localStorage", e);
      }
    }

    setIsHydrated(true);
  }, []);

  // Persist recipes to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("meal-planner-recipes", JSON.stringify(recipes));
    }
  }, [recipes, isHydrated]);

  // Persist meal plan to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("meal-planner-mealplan", JSON.stringify(mealPlan));
    }
  }, [mealPlan, isHydrated]);

  // Recipe actions
  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe]);
  }, []);

  const removeRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const getRecipeById = useCallback(
    (id: string) => recipes.find((r) => r.id === id),
    [recipes]
  );

  // Meal plan actions
  const addMealToDay = useCallback(
    (day: DayMeal["day"], meal: Recipe | null, event?: Person) => {
      const newMeal: DayMeal = {
        id: `${day}-${Date.now()}`,
        day,
        meal,
        event,
      };
      setMealPlan((prev) => ({
        ...prev,
        meals: [...prev.meals, newMeal],
      }));
    },
    []
  );

  const removeMealFromDay = useCallback((id: string) => {
    setMealPlan((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== id),
    }));
  }, []);

  const getMealsByDay = useCallback(
    (day: DayMeal["day"]) =>
      mealPlan.meals.filter((m) => m.day === day),
    [mealPlan]
  );

  const clearAll = useCallback(() => {
    setMealPlan({ meals: [] });
  }, []);

  const recipeValue: RecipeContextType = {
    recipes,
    addRecipe,
    removeRecipe,
    updateRecipe,
    getRecipeById,
  };

  const mealPlanValue: MealPlanContextType = {
    mealPlan,
    addMealToDay,
    removeMealFromDay,
    getMealsByDay,
    clearAll,
  };

  return (
    <RecipeContext.Provider value={recipeValue}>
      <MealPlanContext.Provider value={mealPlanValue}>
        {children}
      </MealPlanContext.Provider>
    </RecipeContext.Provider>
  );
}
