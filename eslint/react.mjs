// @ts-check
// React projects.
import { defineConfig } from 'eslint/config'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { ignores, core } from './internal/core.mjs'
import { prettier } from './internal/prettier.mjs'

export default defineConfig(
  ignores,
  ...core,

  {
    files: ['**/*.{jsx,tsx}'],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'], // React 17+: no need to import React in every file
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off', // TypeScript covers this
      'react/self-closing-comp': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
    },
  },

  prettier,
)
