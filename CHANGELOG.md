# Changelog

## v0.2.0

   - New script: `fix` runs `format`, then `lint:fix`.
   - **Projects must add the `fix` script to `package.json`.** `verify:ds` fails until they do.

## v0.1.0

First test release.

- ESLint configs: `base`, `angular`, `react`
- Shared Prettier config
- `ds-frontend-lint check`, run by `npm run verify:ds`
- Standard files: `eslint.config.mjs`, `.editorconfig`, `.gitattributes`, `.prettierignore`, VS Code settings and extensions
