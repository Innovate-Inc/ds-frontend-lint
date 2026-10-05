#!/usr/bin/env node
// ds-frontend-lint: checks that a project follows dev standards.
//
//   npx ds-frontend-lint check
//
// Read-only: it never changes files. Plain Node, no dependencies.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATES = path.join(PKG_ROOT, 'templates')
const CWD = process.cwd()
const STACKS = ['angular', 'react', 'base']
const PKG_NAME = '@innovate/ds-frontend-lint'
const VERSION = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8')).version
const HEADER = `ds-frontend-lint v${VERSION}: shared ESLint and Prettier standards for Innovate frontend projects`

// Config files that conflict with the shared config. None of these should exist.
const CONFLICTS = [
  'eslint.config.js',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml',
  '.eslintignore',
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.json5',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.toml',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  '.prettierrc.ts',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
  'prettier.config.ts',
]

const SCRIPTS = {
  lint: 'eslint .',
  'lint:fix': 'eslint . --fix',
  format: 'prettier --write .',
  'format:check': 'prettier --check .',
  verify: 'ds-frontend-lint check && eslint . && prettier --check .',
}

const GITIGNORE_BLOCK = [
  '# ds-frontend-lint: commit only the shared VS Code files',
  '.vscode/*',
  '!.vscode/settings.json',
  '!.vscode/extensions.json',
]
// Lines that ignore the whole .vscode folder. Git can't re-include files inside an ignored folder.
const GITIGNORE_BLOCKERS = ['.vscode', '.vscode/', '/.vscode', '/.vscode/']

// This file may hold extra project settings. Only our keys are checked.
const SETTINGS_FILE = '.vscode/settings.json'

// ---------------- helpers ----------------

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null)
const exists = (p) => fs.existsSync(path.join(CWD, p))

function listFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? listFiles(full, base) : [path.relative(base, full)]
  })
}

// Standard files for a stack: { dest: path in the project, src: template path }
//   templates/common/        -> project root
//   templates/<stack>/       -> project root
//   templates/vscode/<stack> -> .vscode/
function standardFiles(stack) {
  const sources = [
    [path.join(TEMPLATES, 'common'), ''],
    [path.join(TEMPLATES, stack), ''],
    [path.join(TEMPLATES, 'vscode', stack), '.vscode'],
  ]
  return sources.flatMap(([root, destDir]) =>
    listFiles(root).map((f) => ({
      dest: path.posix.join(destDir, f.split(path.sep).join('/')),
      src: path.join(root, f),
    })),
  )
}

function fail(msg) {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

// ---------------- check ----------------

function check() {
  const pkgText = read(path.join(CWD, 'package.json'))
  if (pkgText === null) fail('No package.json here. Run this from the project root.')
  const pkg = JSON.parse(pkgText)

  const stack = pkg['ds-frontend-lint']?.stack
  if (!STACKS.includes(stack)) {
    fail(`package.json needs "ds-frontend-lint": { "stack": "<${STACKS.join('|')}>" } (setup step 4).`)
  }

  console.log(`\n${HEADER}\nChecking this project's setup (stack: ${stack})\n`)
  let problems = 0
  const ok = (m) => console.log(`  ✓ ${m}`)
  const bad = (m) => {
    problems++
    console.log(`  ✖ ${m}`)
  }

  for (const f of CONFLICTS) if (exists(f)) bad(`${f} should not exist. Delete it (setup step 2).`)

  for (const { dest, src } of standardFiles(stack)) {
    const theirs = read(path.join(CWD, dest))
    const ours = read(src)

    const step = dest.startsWith('.vscode/') ? 'setup step 5' : 'setup step 3'
    if (theirs === null) {
      bad(`${dest} is missing. Copy it from ds-frontend-lint (${step}).`)
    } else if (dest === SETTINGS_FILE) {
      let current
      try {
        current = JSON.parse(theirs)
      } catch {
        bad(`${dest} is not valid JSON (${step}).`)
        continue
      }
      const wrong = Object.entries(JSON.parse(ours)).filter(
        ([k, v]) => JSON.stringify(current[k]) !== JSON.stringify(v),
      )
      if (wrong.length) bad(`${dest} has missing or changed settings: ${wrong.map(([k]) => k).join(', ')} (${step}).`)
      else ok(dest)
    } else if (theirs.replace(/\r\n/g, '\n') !== ours) {
      bad(`${dest} does not match ds-frontend-lint. Copy it again (${step}).`)
    } else {
      ok(dest)
    }
  }

  if (pkg.prettier !== `${PKG_NAME}/prettier`)
    bad(`package.json "prettier" must be "${PKG_NAME}/prettier" (setup step 4).`)
  else ok('package.json prettier key')

  const wrongScripts = Object.entries(SCRIPTS).filter(([k, v]) => pkg.scripts?.[k] !== v)
  if (wrongScripts.length)
    bad(`package.json scripts missing or changed: ${wrongScripts.map(([k]) => k).join(', ')} (setup step 4).`)
  else ok('package.json scripts')

  if (pkg.eslintConfig) bad('package.json "eslintConfig" should not exist. Remove it (setup step 2).')

  const gi = (read(path.join(CWD, '.gitignore')) ?? '').split(/\r?\n/)
  if (gi.some((l) => GITIGNORE_BLOCKERS.includes(l.trim()))) bad('.gitignore ignores all of .vscode (setup step 5b).')
  else if (!gi.join('\n').includes(GITIGNORE_BLOCK.join('\n')))
    bad('.gitignore is missing the VS Code lines (setup step 5b).')
  else ok('.gitignore')

  if (problems) {
    console.log(`\n✖ ${problems} problem(s). See the ds-frontend-lint README for the expected setup.\n`)
    process.exit(1)
  }
  console.log('\n✓ All standards in place.\n')
}

// ---------------- main ----------------

const cmd = process.argv[2]

if (cmd === 'check') check()
else {
  console.log(`
${HEADER}

Usage:
  npx ds-frontend-lint check

check
  -Checks that this project's lint and format setup matches the standard.
  -Read-only: it never changes files.
  -Runs automatically as the first part of "npm run verify".

Docs: https://github.com/Innovate-Inc/ds-frontend-lint
`)
  process.exit(cmd ? 1 : 0)
}
