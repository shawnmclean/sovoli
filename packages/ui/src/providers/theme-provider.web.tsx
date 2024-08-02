"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

import { GluestackProvider } from "./gluestack-provider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GluestackProvider>{children}</GluestackProvider>
    </NextThemeProvider>
  );
}
