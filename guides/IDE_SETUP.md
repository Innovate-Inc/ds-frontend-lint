# IDE Setup

The project already has the config. You only set up your editor.

## VS Code

1. Open the project. VS Code asks you to install the recommended extensions. Click **Install**.
   (ESLint, Prettier, EditorConfig)
2. That's it. The project's `.vscode/settings.json` turns on format and fix on save.

## PyCharm / WebStorm

PyCharm saves these settings **per project**. To set them once for all future projects,
use **File → New Projects Setup → Settings for New Projects** and do the steps there.
Projects you already opened still need the steps once.

1. **ESLint**: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
   - Select **Automatic ESLint configuration**
   - Check **Run eslint --fix on save**

2. **Prettier**: Settings → Languages & Frameworks → JavaScript → Prettier
   - Select **Automatic Prettier configuration**
   - Check **Run on save**
   - File pattern: `**/*.{js,jsx,ts,tsx,html,css,scss,json,md}`
   - If some types don't format on save, try `{**/*.js,**/*.jsx,**/*.ts,**/*.tsx,**/*.html,**/*.css,**/*.scss,**/*.json,**/*.md}` (no spaces)

3. **EditorConfig**: built in. Nothing to do.

## Check it works

1. Open a `.ts` file, add an unused variable and some messy spacing, and save.
   Spacing gets fixed, and the unused variable gets a warning.
2. Open a `.scss` file, mess up the spacing, and save. It gets fixed.
3. Run `npm run verify:ds`. It should match what your editor shows.
