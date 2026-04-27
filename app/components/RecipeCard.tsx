"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarPlus, ClipboardList, Copy, Pencil, Trash2 } from "lucide-react";
import { Recipe, Ingredient, Person } from "../lib/types";
import { useRecipes } from "../lib/hooks/useRecipes";
import { useMealPlan } from "../lib/hooks/useMealPlan";
import RecipeDetailModal from "./RecipeDetailModal";
import DayPickerModal from "./DayPickerModal";

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
  const { updateRecipe, removeRecipe, addRecipe } = useRecipes();
  const { addMealToDay } = useMealPlan();
  const [editing, setEditing] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [editName, setEditName] = useState(recipe.name);
  const [editSource, setEditSource] = useState(recipe.source ?? "");
  const [editIngredients, setEditIngredients] = useState(
    recipe.ingredients.map((i) => i.name).join(", ")
  );
  const [editSteps, setEditSteps] = useState(recipe.steps?.join("\n") ?? "");
  const [editImageUrl, setEditImageUrl] = useState(recipe.imageUrl ?? "");
  const [previewImageUrl, setPreviewImageUrl] = useState(recipe.imageUrl ?? "");
  useEffect(() => {
    const t = setTimeout(() => setPreviewImageUrl(editImageUrl), 400);
    return () => clearTimeout(t);
  }, [editImageUrl]);

  useEffect(() => {
    if (!editing) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setEditing(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [editing]);

  function saveEdit() {
    const ingredients: Ingredient[] = editIngredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, idx) => ({ id: `${recipe.id}-i${idx}`, name }));
    const steps = editSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateRecipe(recipe.id, {
      name: editName.trim() || recipe.name,
      source: editSource.trim() || undefined,
      imageUrl: editImageUrl.trim() || undefined,
      ingredients,
      steps: steps.length > 0 ? steps : undefined,
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
        onClick={() => setDetailOpen(true)}
        className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-shadow hover:shadow-md"
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

        {/* Actions — always visible on mobile, hover-only on desktop */}
        <div className="flex flex-shrink-0 flex-col gap-1 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); setDayPickerOpen(true); }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-primary/10 hover:text-primary"
            title="Add to day"
          >
            <CalendarPlus size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Edit recipe"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); const base = recipe.name.replace(/^(Copy of )+/i, ""); addRecipe({ ...recipe, id: Date.now().toString(), name: `Copy of ${base}` }); }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Duplicate recipe"
          >
            <Copy size={12} />
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

      {detailOpen && (
        <RecipeDetailModal recipe={recipe} onClose={() => setDetailOpen(false)} />
      )}

      {dayPickerOpen && (
        <DayPickerModal
          onSelect={(day) => addMealToDay(day, recipe)}
          onClose={() => setDayPickerOpen(false)}
        />
      )}

      {/* Edit Modal — portalled to body so it's full-screen centered */}
      {editing &&
        createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-modal-in"
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
                <label className="mb-1 block text-sm font-medium text-foreground">Image URL</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {previewImageUrl && (
                  <img
                    key={previewImageUrl}
                    src={previewImageUrl}
                    alt="Preview"
                    hidden
                    onLoad={(e) => { e.currentTarget.hidden = false; }}
                    onError={(e) => { e.currentTarget.hidden = true; }}
                    className="mt-2 h-28 w-full rounded-lg border border-border object-cover"
                  />
                )}
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
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Steps <span className="font-normal text-muted-foreground">(one per line)</span>
                </label>
                <textarea
                  value={editSteps}
                  onChange={(e) => setEditSteps(e.target.value)}
                  rows={4}
                  placeholder={"Preheat oven to 200°C...\nMix ingredients together..."}
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
