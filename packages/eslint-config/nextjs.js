import nextPlugin from "@next/eslint-plugin-next";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
    },
  },
  {
    files: ['src/pages/**/*', 'src/app/**/{page,default,layout,not-found,robots,sitemap,icon,opengraph-image,twitter-image}.{tsx,ts}', 'src/middleware.ts', 'src/loaders/**/*'],
    rules: {
      'import/no-default-export': 'off',
    },
  }
];
