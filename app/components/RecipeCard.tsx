"use client";

import { Recipe } from "../lib/types";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData("type", "recipe");
        e.dataTransfer.setData("id", recipe.id);
      }}
      className="cursor-move rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
    >
      <h3 className="font-medium text-black dark:text-white">{recipe.name}</h3>
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>📋 {recipe.ingredients.length} ingredients</span>
      </div>
    </div>
  );
}
