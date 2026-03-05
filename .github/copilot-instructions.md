# Copilot Instructions for Weekly Meal Planner

## Project Overview
A Next.js 16 meal planning application using React 19, TypeScript, and Tailwind CSS 4. Currently in early development stage with default scaffolding.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with PostCSS
- **Linting**: ESLint with Next.js config

## Key Directories & Files
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home/index page (currently boilerplate)
  - `globals.css` - Global Tailwind styles
- `public/` - Static assets (logos, images)
- Configuration files at root: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`

## Development Workflows

### Local Development
```bash
npm run dev
# Opens http://localhost:3000
```
Hot reload enabled; changes to `app/` files update immediately in browser.

### Building & Running  
```bash
npm run build  # Compiles TypeScript, optimizes for production
npm start      # Runs production server locally
```

### Code Quality
```bash
npm run lint   # Runs ESLint with Next.js rules
```

## Code Patterns & Conventions

### State Management
- **Context + Hooks pattern** (no Redux/Zustand)
  - `RecipeContext` & `MealPlanContext` in [app/lib/context.tsx](app/lib/context.tsx)
  - Three hooks for component use: `useRecipes()`, `useMealPlan()`, `useShoppingList()`
  - All contexts wrapped by `MealPlannerProvider` in root layout
- **localStorage Persistence**: Automatic sync on state changes
  - Schemas: `meal-planner-recipes`, `meal-planner-mealplan`
  - Hydration check prevents SSR mismatches

### Type System & Data Flow
- **Core types** in [app/lib/types.ts](app/lib/types.ts): Recipe, Ingredient, DayMeal, WeeklyPlan, Person enum
- **API naming conventions**:
  - `addMealToDay(day, meal, event?)` - add recipe or out-event to calendar
  - `getMealsByDay(day)` - retrieve meals for specific day
  - `getRecipeById(id)` - lookup recipe from collection
- **Shopping list** aggregates and deduplicates ingredients, tracks occurrence count

### React Components
- Use **functional components** only
- Default export for page components (`export default function Page()`)
- Named exports for reusable components
- **ESM imports**: All imports must use ES6 syntax (no CommonJS)
- **"use client" directive**: Required for any component using hooks (context, state, events)
- **Context consumption**: `const { recipes, addRecipe } = useRecipes()` pattern

### Tailwind CSS
- **Tailwind 4** with new PostCSS integration
- Use utility classes; avoid custom CSS when possible
- Include **dark mode support**: Add `dark:` prefixed classes when styling (e.g., `dark:bg-black`)
- Reference existing pattern: [app/page.tsx](app/page.tsx#L5) shows dark mode className structure

### File Structure Patterns
- Keep pages in `app/` directory structure matching URL routes
- Create `app/components/` for shared components as app grows
- Create `app/lib/` for utilities and helper functions
- Configuration files are at workspace root (not in subdirectories)

## Linting & Quality Standards
- ESLint configured with:
  - Next.js Core Web Vitals rules
  - TypeScript-specific rules (`eslint-config-next/typescript`)
- Ignored patterns: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Always run `npm run lint` before committing to catch issues

## External Dependencies
- **Minimal base stack**: Extend carefully; add dependencies to both `dependencies` and `devDependencies` as appropriate
- Currently only core Next.js/React packages; future packages should follow similar quality standards

## Deployment Context
- App is configured for **Vercel deployment** (Vercel.com integration default)
- Next.js optimizations already active (image optimization, font loading, etc.)

## Important Notes for AI Agents
1. **Dark mode is expected**: Always include `dark:` classes in Tailwind to maintain aesthetic consistency
2. **Type everything**: Use TypeScript compiler's strict mode — don't rely on implicit `any` types
3. **App Router pattern**: All new pages go in `app/` directory with `page.tsx`. Do NOT use deprecated Pages Router
4. **No custom build scripts needed**: Next.js handles builds; trust `npm run build`
5. **Metadata is centralized**: Update `layout.tsx` metadata for SEO (title, description, etc.)
6. **Provider setup**: All components using hooks must be wrapped by `MealPlannerProvider` in root layout
7. **"use client" required**: Any component using `useRecipes()`, `useMealPlan()`, `useShoppingList()` MUST have `"use client"` at the top
