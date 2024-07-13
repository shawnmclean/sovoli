const { withExpo } = require("@expo/next-adapter");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
        hostname: "books.google.com.jm",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "expo",
    "@sovoli/ui",
    "@sovoli/api",
    "nativewind",
    "react-native",
    "react-native-css-interop",
    "react-native-reanimated",
    "react-native-gesture-handler",
    "solito",
  ],
  experimental: {
    forceSwcTransforms: true,
  } /** We already do linting and typechecking as separate tasks in CI */,
  eslint: { ignoreDuringBuilds: true },
};
module.exports = withExpo(nextConfig);
