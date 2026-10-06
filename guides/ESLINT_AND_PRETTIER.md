# ESLint + Prettier: How They Work Together

**Short version: it's set up. It works. Don't stress.** 😌

## The problem

ESLint and Prettier are two separate tools that both used to care about formatting.

- **ESLint** checks code quality: unused variables, hooks used wrong, missing `alt` text.
- **Prettier** formats code: quotes, spacing, line breaks.

Left alone, they disagree. One fixes your quotes, the other flags them, and you go in circles.

## The fix: they act as one tool

The shared config couples them on purpose:

1. `eslint-config-prettier` turns off every ESLint formatting rule.
   ESLint stops having opinions about how code looks.
2. `eslint-plugin-prettier` runs Prettier inside ESLint for JS and TS files.
   Formatting problems show up as lint errors, and `--fix` applies Prettier's output.

**Prettier decides formatting. ESLint reports problems.** They can't disagree anymore.

## Who handles which files

| Files                                 | Checked by                                         |
| ------------------------------------- | -------------------------------------------------- |
| JS, TS, JSX, TSX                      | ESLint, with Prettier running inside it            |
| Angular templates (HTML)              | ESLint for template rules, Prettier for formatting |
| SCSS, CSS, JSON, Markdown, other HTML | Prettier                                           |

Every path reads the same Prettier settings, so the output is always the same.

## What you actually do

| Task              | Command             |
| ----------------- |---------------------|
| Check everything  | `npm run verify:ds` |
| Fix code problems | `npm run lint:fix`  |
| Format every file | `npm run format`    |

In the IDE: save the file. That's it.

## Why you can't break it

All of this lives in the ds-frontend-lint package, not in your project.
Your project's `eslint.config.mjs` is one line that points at the shared config.
`npm run verify:ds` fails if any of the standard files get changed.

## If something looks wrong

- **Formatting doesn't apply on save:** check the [IDE setup guide](IDE_SETUP.md). It's almost always the Prettier file pattern or the fix-on-save checkbox.
- **`verify:ds` says a standard file changed:** copy it again from ds-frontend-lint (setup steps 3 and 5 in the README).
- **Every line flagged after cloning on Windows:** line endings. Run `git add --renormalize .` and commit.

## Why not Biome?

Biome is one tool that does both, faster, with no coupling needed. We'd like to use it.
It doesn't yet support SCSS, so it can't replace this setup today.
When it does, we switch in one place (ds-frontend-lint) and delete this file. 🎉
