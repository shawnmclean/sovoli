import pluginReact from 'eslint-plugin-react'
import pluginReactNative from 'eslint-plugin-react-native'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import { sharedConfig } from './shared.js'

/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
export const expoConfig = [
  ...sharedConfig,
  // React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ...pluginReact.configs.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      'react-native': pluginReactNative,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...pluginReactNative.configs.all.rules,
      'react-native/no-raw-text': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['**/.eslint.config.js', '**/babel.config.js', '**/build'],
  },
]
