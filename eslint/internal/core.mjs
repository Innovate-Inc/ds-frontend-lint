// Rules shared by every stack. Internal: projects import base, angular or react instead.
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export const ignores = {
  ignores: ['dist/', 'build/', 'coverage/', '.angular/', 'node_modules/'],
}

export const core = [
  // JavaScript and TypeScript
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  // JavaScript only: the core-rule twins of what typescript-eslint turns on for TS, so JS and TS lint the same
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'no-array-constructor': 'error',
      'no-unused-expressions': 'error',
    },
  },

  // TypeScript only
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Tooling files run in Node, not the browser
  {
    files: ['*.config.{js,mjs,cjs,ts,mts,cts}', 'scripts/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Tests: the runner provides describe, it, expect and friends. Covers Jest, Vitest and Jasmine/Karma.
  // Only JS needs this: in TS, no-undef is off and the compiler uses @types/jest or @types/jasmine.
  {
    files: [
      '**/*.{spec,test}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      '**/{__tests__,__mocks__}/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      '**/{setupTests,test-setup,jest.setup,vitest.setup}.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest, ...globals.vitest, ...globals.jasmine },
    },
  },
]
