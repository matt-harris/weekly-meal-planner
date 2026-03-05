"use client";

import { useMealPlan } from "../lib/hooks/useMealPlan";

export default function ClearAllButton() {
  const { clearAll } = useMealPlan();

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all meals for this week?")) {
      clearAll();
    }
  };

  return (
    <button
      onClick={handleClearAll}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      🗑️ Clear All
    </button>
  );
}
