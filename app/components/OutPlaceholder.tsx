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
      className="cursor-move rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 transition-colors hover:bg-amber-500/20"
    >
      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
        {person} Out
      </p>
    </div>
  );
}
