"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // We need to wait for the component to mount to know the initial theme
  // to avoid hydration mismatch issues, especially with 'system' default.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null on the server/initial render
    // to prevent hydration mismatch before theme is known.
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem] transition-all" /> : <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
