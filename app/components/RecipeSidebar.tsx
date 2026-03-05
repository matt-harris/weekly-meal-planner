"use client";

import { useState } from "react";
import { useRecipes } from "../lib/hooks/useRecipes";
import { Recipe } from "../lib/types";
import RecipeCard from "./RecipeCard";

export default function RecipeSidebar() {
  const { recipes, addRecipe } = useRecipes();
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRecipe = () => {
    const name = prompt("Enter recipe name:");
    if (name) {
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name,
        ingredients: [],
        people: [],
      };
      addRecipe(newRecipe);
    }
  };

  return (
    <div className="w-72 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          My Meals
        </h2>
        <button
          onClick={handleAddRecipe}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400"
        >
          +
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-black placeholder-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      <div className="space-y-2 overflow-y-auto">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredRecipes.length} recipes
        </div>
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
