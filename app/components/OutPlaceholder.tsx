"use client";

import { UtensilsCrossed } from "lucide-react";
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
      className="cursor-move rounded-lg border border-border bg-muted p-2.5 transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <UtensilsCrossed size={14} className="flex-shrink-0 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">{person} Out</p>
      </div>
    </div>
  );
}
