import { withExpo } from "@expo/next-adapter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
    turbo: {
      resolveAlias: {
        "react-native": "react-native-web",
      },
      resolveExtensions: [
        ".web.js",
        ".web.jsx",
        ".web.ts",
        ".web.tsx",
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    config.module.rules.push({
      test: /\.ttf$/,
      type: "asset/resource",
    });
    return config;
  },
  transpilePackages: [
    "@sovoli/ui",
    "nativewind",
    "react-native",
    "react-native-web",
  ],
};

export default withExpo(nextConfig);
