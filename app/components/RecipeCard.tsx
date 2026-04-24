"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import { Recipe, Ingredient, Person } from "../lib/types";
import { useRecipes } from "../lib/hooks/useRecipes";

interface RecipeCardProps {
  recipe: Recipe;
}

const PLACEHOLDER_COLORS = [
  "bg-rose-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-blue-400",
  "bg-violet-400",
];

function placeholderColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  return PLACEHOLDER_COLORS[hash % PLACEHOLDER_COLORS.length];
}

function sourceDomain(source?: string) {
  if (!source || !source.startsWith("http")) return null;
  try {
    return new URL(source).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { updateRecipe, removeRecipe } = useRecipes();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(recipe.name);
  const [editSource, setEditSource] = useState(recipe.source ?? "");
  const [editIngredients, setEditIngredients] = useState(
    recipe.ingredients.map((i) => i.name).join(", ")
  );

  function saveEdit() {
    const ingredients: Ingredient[] = editIngredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, idx) => ({ id: `${recipe.id}-i${idx}`, name }));
    updateRecipe(recipe.id, {
      name: editName.trim() || recipe.name,
      source: editSource.trim() || undefined,
      ingredients,
    });
    setEditing(false);
  }

  const domain = sourceDomain(recipe.source);
  const color = placeholderColor(recipe.id);

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData("type", "recipe");
          e.dataTransfer.setData("id", recipe.id);
        }}
        className="group flex cursor-move items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-shadow hover:shadow-md"
      >
        {/* Thumbnail */}
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt=""
            className="h-12 w-12 flex-shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className={`h-12 w-12 flex-shrink-0 rounded-md ${color}`} />
        )}

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{recipe.name}</p>
          {domain && (
            <p className="truncate text-xs text-muted-foreground">{domain}</p>
          )}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <ClipboardList size={11} />
            {recipe.ingredients.length} ingredients
          </p>
        </div>

        {/* Actions (visible on hover) */}
        <div className="flex flex-shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit recipe"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeRecipe(recipe.id); }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete recipe"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Edit Modal — portalled to body so it's full-screen centered */}
      {editing &&
        createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading mb-4 text-lg font-bold text-foreground">Edit Recipe</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Source URL</label>
                <input
                  type="text"
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Ingredients <span className="font-normal text-muted-foreground">(comma-separated)</span>
                </label>
                <textarea
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                  rows={3}
                  placeholder="pasta, feta, tomatoes..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">People</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(Person).map((p) => {
                    const selected = recipe.people.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          const next = selected
                            ? recipe.people.filter((x) => x !== p)
                            : [...recipe.people, p];
                          updateRecipe(recipe.id, { people: next });
                        }}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
