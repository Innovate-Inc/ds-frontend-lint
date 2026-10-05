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
]
