import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MealPlannerProvider } from "./lib/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MealPlannerProvider>{children}</MealPlannerProvider>
      </body>
    </html>
  );
}
