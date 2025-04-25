"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle between light and dark mode, preserving system as default
  const toggleTheme = () => {
    if (!mounted) return;

    // If the current theme is system, we need to toggle based on the resolved theme
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      // If we've already overridden the system preference, toggle between light/dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={toggleTheme}
    >
      {/* Use resolvedTheme for the visual indicator instead of theme */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          resolvedTheme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
