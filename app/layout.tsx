import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { MealPlannerProvider } from "./lib/context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weekly Meal Planner",
  description: "Plan your family meals for the week",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t!=='light')document.documentElement.classList.add('dark');})();`,
          }}
        />
        <MealPlannerProvider>{children}</MealPlannerProvider>
      </body>
    </html>
  );
}
