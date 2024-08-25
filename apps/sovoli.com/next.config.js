import { withGluestackUI } from "@gluestack/ui-next-adapter";

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
        hostname: "lh3.googleusercontent.com",
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
