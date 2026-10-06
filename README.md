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

## Set up a project

Do this on a branch, with no uncommitted changes.
Commands work in any terminal (PowerShell, cmd, Git Bash, macOS, Linux). Run them from the project root.

Requirements: ESLint 9 support. For Angular, a version that angular-eslint 19 or later supports.

### 1. Install

React or vanilla:

```bash
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.5.0 eslint@9 prettier typescript
```

Angular (use the angular-eslint major that matches your Angular major):

```bash
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.5.0 eslint@9 prettier typescript angular-eslint@<angular-major>
```

### 2. Remove old configs

Delete any of these that exist in the project root:

- `eslint.config.js`, `.cjs` or `.ts` (Vite creates `eslint.config.js`)
- `.eslintrc` in any form, and `.eslintignore`
- `.prettierrc` in any form, and `prettier.config.*`
- The `eslintConfig` key in `package.json`

**Before deleting, read them.** If an old config has a rule the project needs, raise it as a proposed change to ds-frontend-lint.

### 3. Copy the config files

In your editor's file tree, open `node_modules/@innovate/ds-frontend-lint/templates/`.
Copy these files into the **project root**. Replace any that already exist.

| From                 | Files                                                |
| -------------------- | ---------------------------------------------------- |
| `templates/common/`  | `.editorconfig`, `.gitattributes`, `.prettierignore` |
| `templates/<stack>/` | `eslint.config.mjs`                                  |

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

| Script                 | What it does                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run fix`          | Main script. Formats every file, then fixes code problems. Shows what you must fix by hand.      |
| `npm run lint`         | Checks JS/TS for problems and formatting                                                         |
| `npm run lint:fix`     | Fixes what can be fixed automatically                                                            |
| `npm run format`       | Formats every file (HTML, SCSS, JSON, Markdown too)                                              |
| `npm run format:check` | Checks formatting without changing files                                                         |
| `npm run verify:ds`    | Checks that the ds-frontend-lint setup is complete and unchanged. Run it after setup and updates. |

`verify:ds` runs `ds-frontend-lint check`. It only reads files. It never changes them.

## Rules

- Most standard files have a "Managed by ds-frontend-lint" header. Don't edit them. `verify:ds` fails if they change.
- Don't add rules or overrides in a project. Propose changes in this repo instead.
- See [guides/RULES.md](guides/RULES.md) for the rules and the reasons behind them.

## Update a project to a new version

1. Read [CHANGELOG.md](CHANGELOG.md) for what changed.
2. Install the new version with the full command. Note the use of the new tag at the end:

```bash
   npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.5.0
```

   **Do not only edit the tag in `package.json`, npm can keep the old version from `package-lock.json` and fail silently.**
3. Run `npm run verify:ds`. It lists any standard file that no longer matches.
4. Copy those files again (setup steps 3 and 6), and apply any `package.json` changes from the changelog. Then run:

   ```bash
   npm run fix
   npm run verify:ds
   ```

5. Commit the changes. Use a separate PR, so the diff contains only the update.

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
