import RecipeSidebar from "./components/RecipeSidebar";
import WeeklyCalendar from "./components/WeeklyCalendar";
import ShoppingList from "./components/ShoppingList";
import ClearAllButton from "./components/ClearAllButton";
import OutPlaceholder from "./components/OutPlaceholder";
import { Person } from "./lib/types";

export default function Home() {
  const people = [Person.Matt, Person.Erin, Person.Isla, Person.Esme];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Left Sidebar */}
      <RecipeSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Weekly Plan
            </h1>
            <div className="flex items-center gap-4">
              <ClearAllButton />
              <button className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 dark:hover:bg-blue-400">
                🛒 Shopping List
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Area */}
        <div className="flex flex-1 overflow-auto">
          <WeeklyCalendar />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6">
          <ShoppingList />
        </div>

        <div className="mb-4">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Out Events
          </h3>
          <div className="space-y-2">
            {people.map((person) => (
              <OutPlaceholder key={person} person={person as Person} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
