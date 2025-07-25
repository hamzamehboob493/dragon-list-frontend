"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-muted transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun className="text-white" /> : <Moon />}
    </button>
  );
};
