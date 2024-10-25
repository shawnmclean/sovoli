"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";

import { useColorScheme } from "../../hooks/useColorScheme";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div>
      <Button
        className="rounded-full p-3.5"
        variant="solid"
        onClick={() => {
          const newTheme = isDarkColorScheme ? "light" : "dark";
          setColorScheme(newTheme);
        }}
      ></Button>
    </div>
  );
}
