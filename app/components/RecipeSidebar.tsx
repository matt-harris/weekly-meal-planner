"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, X, Link, Loader2 } from "lucide-react";
import { useRecipes } from "../lib/hooks/useRecipes";
import { Recipe, Person } from "../lib/types";
import RecipeCard from "./RecipeCard";
import OutPlaceholder from "./OutPlaceholder";

interface RecipeSidebarProps {
  onClose?: () => void;
}

export default function RecipeSidebar({ onClose }: RecipeSidebarProps) {
  const { recipes, addRecipe } = useRecipes();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newSteps, setNewSteps] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | undefined>();
  const [pendingNutrition, setPendingNutrition] = useState<import("../lib/types").Nutrition | undefined>();

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleImport() {
    if (!importUrl.trim()) return;
    setImporting(true);
    setImportError(null);
    try {
      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      if (data.name) setNewName(data.name);
      setNewSource(importUrl.trim());
      if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
        setNewIngredients(data.ingredients.join(", "));
      }
      if (Array.isArray(data.steps) && data.steps.length > 0) {
        setNewSteps(data.steps.join("\n"));
      }
      if (data.imageUrl) setPendingImageUrl(data.imageUrl);
      if (data.nutrition) setPendingNutrition(data.nutrition);
    } catch (err) {
      setImportError((err as Error).message);
    } finally {
      setImporting(false);
    }
  }

  function handleSaveNew() {
    if (!newName.trim()) return;
    const ingredients = newIngredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, idx) => ({ id: `new-${Date.now()}-i${idx}`, name }));
    const steps = newSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: newName.trim(),
      source: newSource.trim() || undefined,
      imageUrl: pendingImageUrl,
      nutrition: pendingNutrition,
      ingredients,
      steps: steps.length > 0 ? steps : undefined,
      people: [],
    };
    addRecipe(newRecipe);
    setAdding(false);
    setNewName("");
    setNewSource("");
    setNewIngredients("");
    setNewSteps("");
    setImportUrl("");
    setImportError(null);
    setPendingImageUrl(undefined);
  }

  function handleOpenAdd() {
    setNewName("");
    setNewSource("");
    setNewIngredients("");
    setNewSteps("");
    setImportUrl("");
    setImportError(null);
    setPendingImageUrl(undefined);
    setPendingNutrition(undefined);
    setAdding(true);
  }

  return (
    <>
      <div className="flex h-full w-72 flex-shrink-0 flex-col border-r border-border bg-card">
        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-5 pb-1">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              My Meals
            </h1>
            <p className="text-xs text-muted-foreground">
              {recipes.length} recipes
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent md:hidden"
                title="Close"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleOpenAdd}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:opacity-90"
              title="Add recipe"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            {filteredRecipes.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No recipes found
              </p>
            )}
          </div>

          {/* Out Events */}
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Out Events
            </h3>
            <div className="space-y-1.5">
              {[Person.Matt, Person.Erin, Person.Isla, Person.Esme].map((p) => (
                <OutPlaceholder key={p} person={p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Recipe Modal — portalled to body so it's full-screen centered */}
      {adding &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setAdding(false)}
          >
            <div
              className="w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl"
              style={{ maxHeight: "calc(100vh - 2rem)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading mb-4 text-lg font-bold text-foreground">Add Recipe</h2>

              {/* URL import */}
              <div className="mb-5 rounded-lg border border-border bg-background p-3">
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Link size={13} />
                  Import from URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleImport()}
                    placeholder="https://..."
                    className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                  <button
                    onClick={handleImport}
                    disabled={importing || !importUrl.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {importing ? <Loader2 size={13} className="animate-spin" /> : null}
                    {importing ? "Fetching…" : "Fetch"}
                  </button>
                </div>
                {importError && (
                  <p className="mt-2 text-xs text-destructive">{importError}</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveNew()}
                    placeholder="Pasta Bake..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Source URL</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Image URL</label>
                  <input
                    type="text"
                    value={pendingImageUrl ?? ""}
                    onChange={(e) => setPendingImageUrl(e.target.value || undefined)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Ingredients <span className="font-normal text-muted-foreground">(comma-separated)</span>
                  </label>
                  <textarea
                    value={newIngredients}
                    onChange={(e) => setNewIngredients(e.target.value)}
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
                    value={newSteps}
                    onChange={(e) => setNewSteps(e.target.value)}
                    rows={4}
                    placeholder={"Preheat oven to 200°C...\nMix ingredients together...\nBake for 30 minutes..."}
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setAdding(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  disabled={!newName.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Add Recipe
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
