module.exports = {
  reactStrictMode: true,
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
    "@sovoli/ui",
    "nativewind",
    "react-native-css-interop",
    "react-native-reanimated",
  ],
};
