"use client";

import { Printer } from "lucide-react";
import { useShoppingList } from "../lib/hooks/useShoppingList";

export default function ShoppingList() {
  const ingredients = useShoppingList();

  return (
    <div data-print-shopping-list>
      {ingredients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No meals planned yet</p>
      ) : (
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b border-border pb-1.5 text-sm text-foreground last:border-0"
            >
              <span>{ingredient.name}</span>
              {ingredient.count > 1 && (
                <span className="text-xs text-muted-foreground">×{ingredient.count}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {ingredients.length > 0 && (
        <div className="mt-5 flex justify-end print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Printer size={14} />
            Print list
          </button>
        </div>
      )}
    </div>
  );
}
