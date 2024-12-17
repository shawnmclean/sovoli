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

  return null;
}
