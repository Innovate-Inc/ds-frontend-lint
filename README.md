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
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v1.0.0 eslint@9 prettier typescript
```

Angular (use the angular-eslint major that matches your Angular major):

```bash
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v1.0.0 eslint@9 prettier typescript angular-eslint@<angular-major>
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
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "verify": "ds-frontend-lint check && eslint . && prettier --check ."
}
```

### 5. Add the VS Code files

Do this step even if you use another editor. The files are for everyone on the project.

**a. Copy the files.** Copy both files from `templates/vscode/<stack>/` into the project's `.vscode/` folder. Create the folder if it doesn't exist.

| File              | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `settings.json`   | Formats and fixes on save                                          |
| `extensions.json` | Prompts VS Code users to install ESLint, Prettier and EditorConfig |

If the project already has a `.vscode/settings.json`, don't replace it. Add our settings to it instead, and keep its other settings.

**b. Fix `.gitignore`.** Remove any line that mentions `.vscode`. Then add:

```
# ds-frontend-lint: commit only the shared VS Code files
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

### 6. First pass and commit

```bash
git add -A
git add --renormalize .
npm run lint:fix
npm run format
npm run verify
git add -A
git commit -m "chore: add ds-frontend-lint"
```

`verify` checks the setup first. If it reports a setup problem, it names the file or step to fix.
After that it may still show real code problems, like a conditional hook or a missing `alt`.
Fix those, or commit and fix them in follow-up work.

## Scripts

| Script                 | What it does                                                                |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run lint`         | Check JS/TS for problems and formatting                                     |
| `npm run lint:fix`     | Fix what can be fixed automatically                                         |
| `npm run format`       | Format every file (HTML, SCSS, JSON, Markdown too)                          |
| `npm run format:check` | Check formatting without changing files                                     |
| `npm run verify`       | Everything: standard setup, lint, formatting. **Run this before you push.** |

`verify` starts with `ds-frontend-lint check`. It only reads files, and it never changes anything.

## Rules

- Standard files have a "Managed by ds-frontend-lint" header. Don't edit them. `verify` fails if they change.
- Don't add rules or overrides in a project. Propose changes in this repo instead.
- See [guides/RULES.md](guides/RULES.md) for the rules and the reasons behind them.

## Update a project to a new version

1. Read [CHANGELOG.md](CHANGELOG.md) for what changed.
2. Change the tag in `package.json`, for example `#v1.0.0` to `#v1.1.0`, and run `npm install`.
3. Run `npm run verify`. It lists any standard file that no longer matches.
4. Copy those files again (setup steps 3 and 5), apply any `package.json` changes from the changelog, then:

```bash
npm run lint:fix
npm run format
npm run verify
```

5. Commit.

## Guides

- [IDE setup](guides/IDE_SETUP.md)
- [How ESLint and Prettier work together](guides/ESLINT_AND_PRETTIER.md)
- [Rules and reasons](guides/RULES.md)
