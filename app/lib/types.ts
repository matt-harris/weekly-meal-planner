/**
 * Weekly Meal Planner - Core Types
 * Minimal types for MVP, expandable as needed
 */

export enum Person {
  Matt = "Matt",
  Erin = "Erin",
  Isla = "Isla",
  Esme = "Esme",
  Family = "Family",
}

export interface Ingredient {
  id: string;
  name: string;
  // quantity and unit deferred to post-MVP
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  people: Person[]; // who this recipe is for
  imageUrl?: string;
  source?: string; // URL or "manual"
}

export interface DayMeal {
  id: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  meal: Recipe | null; // null if it's an "Out" event
  event?: Person; // for events like "Matt Out", "Birthday", etc.
}

export interface WeeklyPlan {
  meals: DayMeal[];
}

export type OutEvent = Pick<DayMeal, "day" | "event">;
