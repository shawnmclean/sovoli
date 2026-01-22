"use client";

import { HeroUIProvider } from "@sovoli/ui/providers";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { CountryProvider } from "~/modules/core/context/CountryProvider";

export function Providers({
  children,
  countryCode,
}: {
  children: React.ReactNode;
  countryCode?: string | null;
}) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={(href: string) => router.push(href)}>
      <ThemeProvider attribute="class" enableSystem>
        <CountryProvider countryCode={countryCode}>{children}</CountryProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
