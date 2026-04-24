"use client";

import { useMealPlan } from "../lib/hooks/useMealPlan";

export default function ClearAllButton() {
  const { clearAll } = useMealPlan();

  return (
    <button
      onClick={() => {
        if (confirm("Clear all meals for this week?")) clearAll();
      }}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      Clear All
    </button>
  );
}
