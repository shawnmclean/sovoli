import { fileURLToPath } from "url";
import { withGluestackUI } from "@gluestack/ui-next-adapter";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qr.expo.dev",
      },
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
  transpilePackages: [
    "@sovoli/ui",
    "@sovoli/api",
    "@sovoli/auth",
    "@sovoli/db",
    "nativewind",
    "react-native-svg",
    "react-native-css-interop",
    "@gluestack-ui/nativewind-utils",
    "react-native-reanimated",
    "react-native-gesture-handler",
    "solito",
  ],
  experimental: {
    // forceSwcTransforms: true,
  } /** We already do linting and typechecking as separate tasks in CI */,
  eslint: { ignoreDuringBuilds: true },
};

export default withGluestackUI(nextConfig);
