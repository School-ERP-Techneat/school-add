"use client";

import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Menu from "@/app/components/Menu";
import { useSchool } from "@/context/SchoolContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { school, loading } = useSchool();
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // ✅ UseLayoutEffect avoids flicker during hydration
  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    console.log("Initial theme:", initialTheme);
    setTheme(initialTheme);
    
    // Only manage the 'dark' class for Tailwind
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Update DOM and localStorage when theme changes
  useLayoutEffect(() => {
    console.log("Theme changed to:", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      console.log("Added dark class");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("Removed dark class");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling theme from", theme, "to", newTheme);
    setTheme(newTheme);
  };

  if (loading) return <p className="text-gray-500">Loading school info...</p>;
  if (!school) return <p className="text-red-500">No school data available.</p>;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-[#F7F8FA] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar & Mobile Drawer */}
      <Menu />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 min-w-0 overflow-y-auto flex flex-col"
      >
        {/* Navbar with Glassmorphism */}
        <div className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm flex items-center justify-between px-4 py-2">
          <Navbar />
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1 }}
          >
            {theme === "light" ? "☀️" : "🌙"}
          </motion.button>
        </div>

        {/* Page Content with Transition */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-6 md:p-8"
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
}
