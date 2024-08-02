"use client";

import { useColorScheme } from "../hooks/useColorScheme";
import { GluestackUIProvider } from "./gluestack-ui-provider";

export function GluestackProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  return (
    <GluestackUIProvider mode={colorScheme}>{children}</GluestackUIProvider>
  );
}
