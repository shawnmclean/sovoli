"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@sovoli/ui/providers";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { env } from "~/env";
import { PostHogPageView } from "./PostHogPageView";
import { FacebookPixel } from "./FacebookPixel";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <SessionProvider>
      <PostHogProvider client={posthog}>
        <Suspense>
          <PostHogPageView />
          <FacebookPixel />
        </Suspense>
        <HeroUIProvider navigate={(href) => router.push(href)}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </HeroUIProvider>
      </PostHogProvider>
    </SessionProvider>
  );
}
