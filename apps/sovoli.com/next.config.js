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
  webpack: (config, { webpack }) => {
    // Needed to get postgres db adapter: https://github.com/vercel/next.js/discussions/50177#discussioncomment-9409065
    // config.externals.push("cloudflare:sockets");
    // config.externalsType = "commonjs";

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

    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
      }),
    );
    return config;
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@sovoli/ui",
    "@sovoli/api",
    "nativewind",
    "react-native-css-interop",
    "@gluestack-ui/nativewind-utils",
    "react-native-reanimated",
    "react-native-gesture-handler",
    "solito",
  ],
  experimental: {
    forceSwcTransforms: true,
  } /** We already do linting and typechecking as separate tasks in CI */,
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
