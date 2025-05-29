import { fileURLToPath } from "url";
import createMDX from "@next/mdx";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  experimental: {
    authInterrupts: true,
  },
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "images.isbndb.com",
      },
      {
        protocol: "https",
        hostname: "ivzknqycaxkrztubruny.supabase.co",
      },
      // Development Bucket
      {
        protocol: "https",
        hostname: "qxvzrmayigmtjhfucogx.supabase.co",
      },
    ],
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@sovoli/ui", "@sovoli/auth", "@sovoli/db"],
  serverExternalPackages: [
    "@opentelemetry/sdk-node",
    "@opentelemetry/instrumentation",
    "pino",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
