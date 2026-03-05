"use client";

import { Person } from "../lib/types";

interface OutPlaceholderProps {
  person: Person;
}

export default function OutPlaceholder({ person }: OutPlaceholderProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData("type", "out");
        e.dataTransfer.setData("id", person);
      }}
      className="cursor-move rounded-lg border border-amber-300 bg-amber-50 p-3 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900 dark:hover:bg-amber-800"
    >
      <h3 className="font-medium text-amber-900 dark:text-amber-100">
        🍺 {person} Out
      </h3>
    </div>
  );
}
