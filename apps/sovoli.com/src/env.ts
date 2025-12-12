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
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z
      .string()
      .min(1)
      .default("placeholder"),
    NEXT_PUBLIC_ROOT_DOMAIN: z
      .string()
      .min(1)
      .default("localhost"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    POSTGRES_URL: z.string().url().default("https://example.com"),
    TRIGGER_SECRET_KEY: z.string().default("placeholder"),
    SUPABASE_URL: z.string().min(1).default("https://example.com"),
    SUPABASE_ANON_KEY: z.string().min(1).default("placeholder"),
    CLOUDINARY_API_SECRET: z.string().min(1).default("placeholder"),
    CLOUDINARY_API_KEY: z.string().min(1).default("placeholder"),
    AUTH_SECRET: z.string().min(1).default("placeholder"),
    META_ACCESS_TOKEN: z.string().min(1).default("placeholder"),
    WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).default("placeholder"),
    AIRTABLE_API_KEY: z.string().min(1).default("placeholder"),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url()
      .default("https://example.com"),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).default("placeholder"),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z
      .string()
      .min(1)
      .default("placeholder"),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.com",
    NEXT_PUBLIC_POSTHOG_KEY:
      process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "placeholder",
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "placeholder",
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost",
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "placeholder",
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
