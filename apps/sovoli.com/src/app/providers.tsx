"use client";

import { useRouter } from "next/navigation";
import { UIProviders } from "@sovoli/ui/providers";
import { SessionProvider } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { QueryProviders } from "~/api/react";
import { env } from "~/env";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <SessionProvider>
      <PostHogProvider client={posthog}>
        <UIProviders navigate={(href) => router.push(href)}>
          <QueryProviders>{children}</QueryProviders>
        </UIProviders>
      </PostHogProvider>
    </SessionProvider>
  );
}
