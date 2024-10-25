"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface UIProvidersProps {
  children: React.ReactNode;
  navigate: (href: string) => void;
}

export function UIProviders({ children, navigate }: UIProvidersProps) {
  return (
    <NextUIProvider navigate={navigate}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
