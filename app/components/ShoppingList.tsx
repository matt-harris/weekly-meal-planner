"use client";

import { useShoppingList } from "../lib/hooks/useShoppingList";

export default function ShoppingList() {
  const ingredients = useShoppingList();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Shopping List
      </h3>
      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No meals planned yet
        </p>
      ) : (
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
            >
              <span>{ingredient.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                ×{ingredient.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
