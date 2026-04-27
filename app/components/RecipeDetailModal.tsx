"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink } from "lucide-react";
import { Recipe } from "../lib/types";

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

function sourceDomain(source?: string) {
  if (!source?.startsWith("http")) return null;
  try {
    return new URL(source).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export default function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  const domain = sourceDomain(recipe.source);
  const hasSteps = recipe.steps && recipe.steps.length > 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-modal-in"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt=""
            className="h-52 w-full object-cover"
          />
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <X size={15} />
        </button>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: recipe.imageUrl ? "calc(100vh - 2rem - 13rem)" : "calc(100vh - 2rem)" }}>
          {/* Title + meta */}
          <div className="mb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">{recipe.name}</h2>
            {recipe.nutrition && (
              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.nutrition.calories && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{recipe.nutrition.calories}</span>
                )}
                {recipe.nutrition.protein && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{recipe.nutrition.protein} protein</span>
                )}
                {recipe.nutrition.carbs && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{recipe.nutrition.carbs} carbs</span>
                )}
                {recipe.nutrition.fat && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{recipe.nutrition.fat} fat</span>
                )}
              </div>
            )}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {domain && recipe.source && (
                <a
                  href={recipe.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink size={11} />
                  {domain}
                </a>
              )}
              {recipe.people.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recipe.people.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ingredients + Steps */}
          <div className={`grid gap-6 ${hasSteps ? "sm:grid-cols-2" : ""}`}>
            {/* Ingredients */}
            {recipe.ingredients.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Ingredients
                </h3>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing.id} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {ing.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            {hasSteps && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Steps
                </h3>
                <ol className="space-y-3">
                  {recipe.steps!.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
