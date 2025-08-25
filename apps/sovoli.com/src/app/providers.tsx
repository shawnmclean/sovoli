"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@sovoli/ui/providers";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={(href) => router.push(href)}>
      <ThemeProvider attribute="class" enableSystem>
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
