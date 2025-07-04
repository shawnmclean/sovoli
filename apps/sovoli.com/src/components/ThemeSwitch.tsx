"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@sovoli/ui/components/button";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="flat"
      isIconOnly
      radius="full"
      aria-label="Toggle theme"
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  );
};
