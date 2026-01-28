import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    TRIGGER_SECRET_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AIRTABLE_API_KEY: z.string().min(1),
    META_PARTNER_BM_ID: z.string().optional(),
    META_PARTNER_SYSTEM_USER_TOKEN: z.string().optional(),
    PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN: z.string().optional(),
    META_APP_ID: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1),
    // We don't need a map id for just advanced markers, but putting this here for future reference.
    // see: https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: z.string().default("DEMO_MAP_ID"),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  },
});
