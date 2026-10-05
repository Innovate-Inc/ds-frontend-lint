// Runs Prettier inside ESLint and turns off conflicting ESLint rules.
// Must be the LAST entry in every config.
// Scoped to JS/TS. Prettier formats HTML, SCSS, JSON and the rest directly.
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export const prettier = {
  ...prettierRecommended,
  files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
}
