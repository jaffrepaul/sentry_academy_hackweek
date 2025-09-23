import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat()

const config = [
  // Global ignores
  { ignores: ['dist', '.next', 'node_modules', 'out', 'next-env.d.ts'] },

  // Base JavaScript configuration
  js.configs.recommended,

  // Next.js configuration for all JS/TS files
  ...compat.extends('next/core-web-vitals'),

  // TypeScript files configuration
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Next.js specific rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // TypeScript rules - relaxed for existing codebase
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off', // Allow any types for now
      '@typescript-eslint/no-unsafe-assignment': 'off', // Allow unsafe assignments
      '@typescript-eslint/no-unsafe-member-access': 'off', // Allow unsafe member access
      '@typescript-eslint/no-unsafe-call': 'off', // Allow unsafe calls
      '@typescript-eslint/no-unsafe-argument': 'off', // Allow unsafe arguments
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/require-await': 'off', // Allow async functions without await
      '@typescript-eslint/no-floating-promises': 'off', // Allow floating promises for now
      '@typescript-eslint/no-misused-promises': 'off', // Allow promise misuse for now
      '@typescript-eslint/restrict-template-expressions': 'off', // Allow any in template literals
      '@typescript-eslint/ban-ts-comment': 'warn', // Warn instead of error for ts-ignore
      '@typescript-eslint/no-empty-object-type': 'off', // Allow empty object types
      '@typescript-eslint/no-unsafe-return': 'off', // Allow unsafe returns
      '@typescript-eslint/no-base-to-string': 'off', // Allow object stringification
      'no-useless-catch': 'off', // Allow useless catch blocks
      'react/no-unescaped-entities': 'warn', // Warn instead of error for unescaped entities
      'react/jsx-no-comment-textnodes': 'off', // Allow comment text nodes

      // Performance rules
      'react-hooks/exhaustive-deps': 'warn',

      // Code quality rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // JavaScript files configuration (disable TypeScript-specific rules)
  {
    files: ['**/*.js', '**/*.mjs'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // Next.js specific rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // Code quality rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
]

export default config
