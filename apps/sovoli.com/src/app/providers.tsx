"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@sovoli/ui/providers";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <SessionProvider>
      <HeroUIProvider navigate={(href) => router.push(href)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
