"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";

export function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  const { data: session } = useSession();

  useEffect(() => {
    // Track pageviews
    let url = window.origin + pathname;
    if (searchParams.toString()) {
      url = url + `?${searchParams.toString()}`;
    }
    posthog.capture("$pageview", {
      $current_url: url,
    });
  }, [pathname, searchParams, posthog]);

  useEffect(() => {
    // 👉 Check the sign-in status and user info,
    //    and identify the user if they aren't already
    if (session?.user && !posthog._isIdentified()) {
      // 👉 Identify the user
      posthog.identify(session.userId, {
        email: session.user.email,
        username: session.user.username,
      });
    }

    if (!session?.user && posthog._isIdentified()) {
      posthog.reset();
    }
  }, [posthog, session]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let maxScroll = 0;
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = Math.round((scrollTop / docHeight) * 100);

      if (percent > maxScroll) maxScroll = percent;

      for (const threshold of thresholds) {
        if (percent >= threshold && !fired.has(threshold)) {
          posthog.capture("scrolled_percent", {
            percent: threshold,
          });
          fired.add(threshold);
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, posthog]);

  return null;
}
