# Frontend Dev Standards: ds-frontend-lint

Shared lint and format standards for Innovate frontend projects. Part of the Innovate dev standards: see [ds-hub](https://github.com/Innovate-Inc/ds-hub).
This repo is public, so anyone can install it with no login or setup.
One package gives every project the same ESLint rules, Prettier settings, editor settings and line ending rules.

## Stacks

| Stack     | Use for                                 |
| --------- | --------------------------------------- |
| `angular` | Angular apps                            |
| `react`   | React apps                              |
| `base`    | Vanilla JS/TS, Node services, libraries |

## Update an existing frontend project to a new version of ds-frontend-lint

1. Read [CHANGELOG.md](CHANGELOG.md) for what changed.
2. Install the new version with the full command below. **Do not only edit the tag in `package.json` and rely on `npm i`. npm can keep the old version from `package-lock.json`, and it does not tell you.**

```bash
   npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.8.0
```

3. Run `npm run verify:ds`. It lists any standard file that no longer matches. If all is successful, skip to step 5.
4. Copy or Edit those files again as instructed by the results of `verify:ds` (steps 3 - 6 in the initial install guide below). Then run:

   ```bash
   npm run fix
   npm run verify:ds
   ```

5. Commit the changes. Use a separate 'formatting/linting only' PR, so the diff contains only the update.

## Bringing ds-frontend-lint to a project for the first time

This package is designed to be installed once in a new or existing project. The guide below
works for React, Angular, and vanilla JS/TS. The steps are the same for all stacks, and new/existing projects can
use the same setup.

**Do these steps on a branch, with no uncommitted changes.**

Commands work in any terminal (PowerShell, cmd, Git Bash, macOS, Linux). Run them from the project root.

Requirements: ESLint 9 support. For Angular, a version that angular-eslint 19 or later supports.

### 1. Install

React or vanilla:

```bash
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.8.0 eslint@9 prettier typescript
```

Angular (use the angular-eslint major that matches your Angular major):

```bash
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.8.0 eslint@9 prettier typescript angular-eslint@<angular-major>
```

### 2. Remove old configs

Delete any of these that exist in the project root:

- `eslint.config.js`, `.cjs` or `.ts` (Vite creates `eslint.config.js`)
- `.eslintrc` in any form, and `.eslintignore`
- `.prettierrc` in any form, and `prettier.config.*`
- The `eslintConfig` key in `package.json`

**Before deleting, read them.** If an old config has a rule the project needs, raise it as a proposed change to ds-frontend-lint.

Then remove the old lint packages. ds-frontend-lint brings its own ESLint plugins and configs. Copies in the project's
`devDependencies` are bloat, and can be a different version from the one the standard uses.

List the lint packages the project has:

```bash
npm ls --depth=0 | grep -i -E "eslint|prettier|globals"
```

**Keep** `@innovate/ds-frontend-lint`, `eslint`, `prettier` and `typescript`, and `angular-eslint` in Angular projects.
**Remove** the rest. The common ones:

| Package                                                                                               | Why it can go                                          |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `@eslint/js`, `globals`, `typescript-eslint`                                                          | ds-frontend-lint includes them.                        |
| `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`                                       | The old two-package form of `typescript-eslint`.       |
| `eslint-config-prettier`, `eslint-plugin-prettier`                                                    | ds-frontend-lint includes them.                        |
| `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`                          | ds-frontend-lint includes them.                        |
| `eslint-plugin-react-refresh`                                                                         | Vite adds it. The standard doesn't use it.             |
| `@angular-eslint/builder`, `@angular-eslint/eslint-plugin` and the other `@angular-eslint/*` packages | `angular-eslint` includes them.                        |
| Other shared configs and plugins, like `eslint-config-airbnb` or `eslint-plugin-import`               | Another standard. Read the old config first, as above. |

```bash
npm uninstall <package> <package> ...
```

If a file other than the old lint config imports one of these, like a test setup that imports `globals`, keep that package.

In Angular projects, lint with `npm run lint`, not `ng lint`.

### 3. Copy the config files

In your editor's file tree, open `node_modules/@innovate/ds-frontend-lint/templates/`.
Copy these files into the **project root**. Replace any that already exist.

| From                 | Files                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| `templates/common/`  | `.editorconfig`, `.gitattributes`, `.prettierignore`, `eslint.overrides.mjs` |
| `templates/<stack>/` | `eslint.config.mjs`                                                          |

`eslint.overrides.mjs` belongs to the project. On later updates, never replace it. See [Project overrides](#project-overrides).

### 4. Edit package.json

Add these keys. Set `stack` to your stack. Keep the project's other scripts.
If the project already has scripts with these names, check what they did before replacing them.

```json
"prettier": "@innovate/ds-frontend-lint/prettier",
"ds-frontend-lint": { "stack": "react" },
"scripts": {
  "fix": "prettier --write . && eslint . --fix",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "verify:ds": "ds-frontend-lint check"
}
```

### 5. Edit .gitignore

Remove any line that mentions `.vscode`. Then add:

```
# ds-frontend-lint: commit only the shared VS Code files
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

### 6. Add the VS Code files

Do this step even if you use another editor. The files are for everyone on the project.

Copy both files from `templates/vscode/<stack>/` into the project's `.vscode/` folder. Create the folder if it doesn't exist.

| File              | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `settings.json`   | Formats and fixes on save                                          |
| `extensions.json` | Prompts VS Code users to install ESLint, Prettier and EditorConfig |

If the project already has a `.vscode/settings.json`, don't replace it. Add our settings to it instead, and keep its other settings.

### 7. First pass and commit

```bash
git add -A
git add --renormalize .
npm run fix
npm run verify:ds
git add -A
git commit -m "chore: add ds-frontend-lint"
```

`verify:ds` checks the setup. If it finds a problem, it names the file and the step to fix.

`fix` can still show code problems that you must fix by hand, like a conditional hook or a missing `alt`.
Fix those, or commit and fix them in follow-up work.

## Scripts

| Script                 | What it does                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run fix`          | Main script. Formats every file, then fixes code problems. Shows what you must fix by hand.       |
| `npm run lint`         | Checks JS/TS for problems and formatting                                                          |
| `npm run lint:fix`     | Fixes what can be fixed automatically                                                             |
| `npm run format`       | Formats every file (HTML, SCSS, JSON, Markdown too)                                               |
| `npm run format:check` | Checks formatting without changing files                                                          |
| `npm run verify:ds`    | Checks that the ds-frontend-lint setup is complete and unchanged. Run it after setup and updates. |

`verify:ds` runs `ds-frontend-lint check`. It only reads files. It never changes them.

## Rules

- Most standard files have a "Managed by ds-frontend-lint" header. Don't edit them. `verify:ds` fails if they change.
- Don't change rules in a project, except through `eslint.overrides.mjs`. See [Project overrides](#project-overrides).
- See [guides/RULES.md](guides/RULES.md) for the rules and the reasons behind them.

## Project overrides

Overrides are a last resort. Add one to `eslint.overrides.mjs` only when:

- **The project is migrating to the standard.** For example, adopting it shows 2000 problems that nobody will fix today.
  Scope it to the legacy code with `files`, and delete it once that code is fixed.
- **The standard doesn't fit the project.** For example, a library that needs its own Angular selector prefix.
  If several projects need the same override, propose it in this repo instead.

> [!IMPORTANT]
> **Every override needs a `name` that starts with `migration:` or `permanent:`, then says why.**
> `verify:ds` fails without one.
>
> | Prefix       | Use when                                           | Example name                                    |
> | ------------ | -------------------------------------------------- | ----------------------------------------------- |
> | `migration:` | Legacy code isn't fixed yet. Delete it when it is. | `'migration: legacy admin pages still use var'` |
> | `permanent:` | The standard doesn't fit this project.             | `'permanent: shared UI library uses ui prefix'` |

For migration, turning a rule `off` is fine. 2000 lines of warnings hide the warnings that matter.

```js
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'migration: legacy admin pages still use var',
    files: ['src/legacy-admin/**/*.js'],
    rules: { 'no-var': 'off', 'prefer-const': 'off' },
  },
  {
    name: 'permanent: shared UI library uses the ui prefix',
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'ui', style: 'kebab-case' }],
    },
  },
]
```

`verify:ds` checks overrides and lists them, so nothing is silenced out of sight:

- Every override needs a `migration:` or `permanent:` name (see above).
- Overrides can't change `prettier/prettier`. Formatting is the same everywhere.
- A migration override without `files` gets a warning, because it applies to the whole project.

## Help us improve setup

Setup is manual for now. Our plan is to move towards a command-based setup that installs everything in one clean step.

Your experience helps us build it. If a step was unclear, slow or easy to get wrong, please tell us.
Open an issue in this repo, and say:

- Which step it was
- What happened
- What you expected

Thank you!

## Guides

- [IDE setup](guides/IDE_SETUP.md)
- [How ESLint and Prettier work together](guides/ESLINT_AND_PRETTIER.md)
- [Rules and reasons](guides/RULES.md)
