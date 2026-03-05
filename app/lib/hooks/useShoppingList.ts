"use client";

import { useMemo } from "react";
import { useMealPlan } from "./useMealPlan";
import { useRecipes } from "./useRecipes";
import { Ingredient } from "../types";

export interface ShoppingListItem extends Ingredient {
  count: number;
}

/**
 * Aggregates all ingredients from meals in the week
 * Deduplicates by ingredient name
 * Returns list with occurrence count
 */
export function useShoppingList(): ShoppingListItem[] {
  const { mealPlan } = useMealPlan();
  const { getRecipeById } = useRecipes();

  const shoppingList = useMemo(() => {
    const ingredients: Record<string, ShoppingListItem> = {};

    mealPlan.meals.forEach((dayMeal) => {
      if (dayMeal.meal) {
        const recipe = getRecipeById(dayMeal.meal.id);
        if (recipe) {
          recipe.ingredients.forEach((ingredient) => {
            const key = ingredient.name.toLowerCase();
            if (ingredients[key]) {
              ingredients[key].count += 1;
            } else {
              ingredients[key] = {
                ...ingredient,
                count: 1,
              };
            }
          });
        }
      }
    });

    return Object.values(ingredients).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [mealPlan, getRecipeById]);

  return shoppingList;
}
