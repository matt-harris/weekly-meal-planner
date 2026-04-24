"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import RecipeSidebar from "./components/RecipeSidebar";
import WeeklyCalendar from "./components/WeeklyCalendar";
import ClearAllButton from "./components/ClearAllButton";
import ShoppingListButton from "./components/ShoppingListButton";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:z-auto md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <RecipeSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                  Weekly Plan
                </h1>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  Drag meals from your collection to plan your week
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ClearAllButton />
              <ShoppingListButton />
            </div>
          </div>
        </div>

        {/* Calendar Area */}
        <div className="flex flex-1 overflow-auto">
          <WeeklyCalendar />
        </div>
      </div>
    </div>
  );
}
