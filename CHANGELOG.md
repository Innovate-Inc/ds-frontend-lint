# Changelog

## v0.8.0

- New: project overrides in `eslint.overrides.mjs`. See "Project overrides" in the README. `verify:ds` checks and lists them.
- JS and TS files now lint the same. JS files get `no-var`, `prefer-const`, `prefer-rest-params`, `prefer-spread`,
  `no-array-constructor` and `no-unused-expressions`, which TS files already had. Legacy JS may show new errors:
  `npm run fix` fixes most `no-var` and `prefer-const`. Use a migration override for the rest.
- `no-unused-vars` is a warning in JS files too, as it already was in TS.
- Test files get Jest, Vitest and Jasmine globals. JS tests no longer show `'describe' is not defined` errors.
- README: setup step 2 now covers removing old ESLint and Prettier packages that ds-frontend-lint already includes.
- **Projects must copy the new `eslint.config.mjs` from `templates/<stack>/` and add `eslint.overrides.mjs` from
  `templates/common/`.** `verify:ds` fails until they do.

## v0.7.0

- Updates README update instructions.

## v0.6.0

- Updates README ordering of sections.

## v0.5.0

- Updates README typo.

## v0.4.0

- Updates IDE Setup guide.

## v0.3.0

- Updates README with explicit instructions for the update step - users should run the full install command as described in the README.

## v0.2.0

- New script: `fix` runs `format`, then `lint:fix`.
- **Projects must add the `fix` script to `package.json`.** `verify:ds` fails until they do.

## v0.1.0

First test release.

- ESLint configs: `base`, `angular`, `react`
- Shared Prettier config
- `ds-frontend-lint check`, run by `npm run verify:ds`
- Standard files: `eslint.config.mjs`, `.editorconfig`, `.gitattributes`, `.prettierignore`, VS Code settings and extensions
