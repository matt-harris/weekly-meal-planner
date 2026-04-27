"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode, useMemo } from "react";
import { Recipe, WeeklyPlan, DayMeal, Person } from "./types";

// ── Week helpers ──────────────────────────────────────────────────────────────

function isoMonday(d: Date): string {
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function addWeeks(isoDate: string, n: number): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + n * 7);
  return d.toISOString().slice(0, 10);
}

// ── Recipe Context ────────────────────────────────────────────────────────────

export interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// ── MealPlan Context ──────────────────────────────────────────────────────────

export interface MealPlanContextType {
  mealPlan: WeeklyPlan;
  weekStart: string;
  isCurrentWeek: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
  addMealToDay: (day: DayMeal["day"], meal: Recipe | null, event?: Person) => void;
  removeMealFromDay: (id: string) => void;
  reorderMeals: (day: DayMeal["day"], draggedId: string, targetId: string, before: boolean) => void;
  getMealsByDay: (day: DayMeal["day"]) => DayMeal[];
  clearAll: () => void;
}

export const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// ── Demo seed data ────────────────────────────────────────────────────────────

const DEMO_RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Baked Feta Pasta",
    ingredients: [
      { id: "i1", name: "pasta" },
      { id: "i2", name: "feta" },
      { id: "i3", name: "tomato" },
    ],
    people: [Person.Family],
    source: "demo",
  },
  {
    id: "r2",
    name: "Chicken & Rice",
    ingredients: [
      { id: "i4", name: "chicken" },
      { id: "i5", name: "rice" },
      { id: "i6", name: "peas" },
    ],
    people: [Person.Matt, Person.Erin],
    source: "demo",
  },
  {
    id: "r3",
    name: "Cauliflower Cheese Soup",
    ingredients: [
      { id: "i7", name: "cauliflower" },
      { id: "i8", name: "cheese" },
    ],
    people: [Person.Family],
    source: "demo",
  },
];

// ── Provider ──────────────────────────────────────────────────────────────────

export function MealPlannerProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allWeeks, setAllWeeks] = useState<Record<string, DayMeal[]>>({});
  const [weekStart, setWeekStart] = useState<string>(() => isoMonday(new Date()));
  const [isHydrated, setIsHydrated] = useState(false);

  const realWeekStart = isoMonday(new Date());
  const prevWeekStart = addWeeks(realWeekStart, -1);
  const nextWeekStart = addWeeks(realWeekStart, 1);
  const allowedWeeks = [prevWeekStart, realWeekStart, nextWeekStart];

  const isCurrentWeek = weekStart === realWeekStart;
  const canGoPrev = weekStart !== prevWeekStart;
  const canGoNext = weekStart !== nextWeekStart;

  const mealPlan: WeeklyPlan = useMemo(
    () => ({ meals: allWeeks[weekStart] ?? [] }),
    [allWeeks, weekStart]
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem("meal-planner-recipes");
    if (savedRecipes) {
      try {
        const parsed = JSON.parse(savedRecipes);
        setRecipes(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_RECIPES);
      } catch {
        setRecipes(DEMO_RECIPES);
      }
    } else {
      setRecipes(DEMO_RECIPES);
    }

    const savedWeeks = localStorage.getItem("meal-planner-weeks");
    if (savedWeeks) {
      try {
        setAllWeeks(JSON.parse(savedWeeks));
      } catch {
        // ignore corrupt data
      }
    } else {
      // migrate legacy single-week format
      const legacy = localStorage.getItem("meal-planner-mealplan");
      if (legacy) {
        try {
          const plan: WeeklyPlan = JSON.parse(legacy);
          setAllWeeks({ [isoMonday(new Date())]: plan.meals });
        } catch {
          // ignore
        }
      }
    }

    setIsHydrated(true);
  }, []);

  // Persist recipes
  useEffect(() => {
    if (isHydrated) localStorage.setItem("meal-planner-recipes", JSON.stringify(recipes));
  }, [recipes, isHydrated]);

  // Persist weeks — pruned to only the 3 allowed keys
  useEffect(() => {
    if (!isHydrated) return;
    const pruned: Record<string, DayMeal[]> = {};
    for (const key of allowedWeeks) {
      if (allWeeks[key]) pruned[key] = allWeeks[key];
    }
    localStorage.setItem("meal-planner-weeks", JSON.stringify(pruned));
  }, [allWeeks, isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ───────────────────────────────────────────────────────────────

  const updateWeekMeals = useCallback(
    (updater: (meals: DayMeal[]) => DayMeal[]) => {
      setAllWeeks((prev) => ({
        ...prev,
        [weekStart]: updater(prev[weekStart] ?? []),
      }));
    },
    [weekStart]
  );

  // ── Recipe actions ────────────────────────────────────────────────────────

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe]);
  }, []);

  const removeRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const getRecipeById = useCallback(
    (id: string) => recipes.find((r) => r.id === id),
    [recipes]
  );

  // ── Meal plan actions ─────────────────────────────────────────────────────

  const addMealToDay = useCallback(
    (day: DayMeal["day"], meal: Recipe | null, event?: Person) => {
      const newMeal: DayMeal = { id: `${day}-${Date.now()}`, day, meal, event };
      updateWeekMeals((meals) => [...meals, newMeal]);
    },
    [updateWeekMeals]
  );

  const removeMealFromDay = useCallback(
    (id: string) => updateWeekMeals((meals) => meals.filter((m) => m.id !== id)),
    [updateWeekMeals]
  );

  const reorderMeals = useCallback(
    (day: DayMeal["day"], draggedId: string, targetId: string, before: boolean) => {
      updateWeekMeals((meals) => {
        const dayMeals = meals.filter((m) => m.day === day);
        const others = meals.filter((m) => m.day !== day);
        const dragged = dayMeals.find((m) => m.id === draggedId);
        if (!dragged) return meals;
        const without = dayMeals.filter((m) => m.id !== draggedId);
        const targetIdx = without.findIndex((m) => m.id === targetId);
        if (targetIdx === -1) return meals;
        without.splice(before ? targetIdx : targetIdx + 1, 0, dragged);
        return [...others, ...without];
      });
    },
    [updateWeekMeals]
  );

  const getMealsByDay = useCallback(
    (day: DayMeal["day"]) => mealPlan.meals.filter((m) => m.day === day),
    [mealPlan]
  );

  const clearAll = useCallback(
    () => updateWeekMeals(() => []),
    [updateWeekMeals]
  );

  const goToPrevWeek = useCallback(() => {
    if (canGoPrev) setWeekStart((w) => addWeeks(w, -1));
  }, [canGoPrev]);

  const goToNextWeek = useCallback(() => {
    if (canGoNext) setWeekStart((w) => addWeeks(w, 1));
  }, [canGoNext]);

  const goToCurrentWeek = useCallback(() => {
    setWeekStart(isoMonday(new Date()));
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, removeRecipe, updateRecipe, getRecipeById }}>
      <MealPlanContext.Provider value={{
        mealPlan, weekStart, isCurrentWeek, canGoPrev, canGoNext,
        goToPrevWeek, goToNextWeek, goToCurrentWeek,
        addMealToDay, removeMealFromDay, reorderMeals, getMealsByDay, clearAll,
      }}>
        {children}
      </MealPlanContext.Provider>
    </RecipeContext.Provider>
  );
}
