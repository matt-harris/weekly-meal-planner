"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMealPlan } from "../lib/hooks/useMealPlan";

export default function ClearAllButton() {
  const { clearAll } = useMealPlan();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setConfirming(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [confirming]);

  function handleConfirm() {
    clearAll();
    setConfirming(false);
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Clear All
      </button>

      {confirming &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setConfirming(false)}
          >
            <div
              className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading mb-1 text-lg font-bold text-foreground">Clear this week?</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                All planned meals for this week will be removed. This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
