"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@sovoli/ui/providers";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { env } from "~/env";
import { PostHogPageView } from "./PostHogPageView";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    capture_pageleave: false,
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <SessionProvider>
      <PHProvider>
        <Suspense>
          <PostHogPageView />
        </Suspense>
        <HeroUIProvider navigate={(href) => router.push(href)}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </HeroUIProvider>
      </PHProvider>
    </SessionProvider>
  );
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  const maxPercentage = useRef(0);
  const maxPixels = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const lastPercentage = Math.min(
        1,
        (window.innerHeight + window.pageYOffset) / document.body.offsetHeight,
      );
      const lastPixels = window.innerHeight + window.pageYOffset;
      if (lastPercentage > maxPercentage.current) {
        maxPercentage.current = lastPercentage;
      }

      if (lastPixels > maxPixels.current) {
        maxPixels.current = lastPixels;
      }
    }

    function handlePageLeave() {
      posthog.capture("$pageleave", {
        "max scroll percentage": maxPercentage.current,
        "max scroll pixels": maxPixels.current,
        "last scroll percentage": Math.min(
          1,
          (window.innerHeight + window.pageYOffset) /
            document.body.offsetHeight,
        ),
        "last scroll pixels": window.innerHeight + window.pageYOffset,
        scrolled: maxPixels.current > 0,
      });
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", handlePageLeave);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handlePageLeave);
    };
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
