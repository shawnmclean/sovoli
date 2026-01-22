import posthog from "posthog-js";
import { env } from "~/env";

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2025-05-24",
  person_profiles: "always", //switch this to always so we can get the initial user profile for fb metrics
});
