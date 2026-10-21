#!/usr/bin/env node
// ds-frontend-lint: checks that a project follows dev standards.
//
//   npx ds-frontend-lint check
//
// Read-only: it never changes files. Plain Node, no dependencies.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

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
  fix: 'prettier --write . && eslint . --fix',
  lint: 'eslint .',
  'lint:fix': 'eslint . --fix',
  format: 'prettier --write .',
  'format:check': 'prettier --check .',
  'verify:ds': 'ds-frontend-lint check',
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

// This file belongs to the project. Its content is never compared, only checked for a valid shape.
const OVERRIDES_FILE = 'eslint.overrides.mjs'
const OVERRIDE_NAME = /^(migration|permanent):\s*\S/i

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

async function check() {
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

    const step = dest.startsWith('.vscode/') ? 'setup step 6' : 'setup step 3'
    if (theirs === null) {
      bad(`${dest} is missing. Copy it from ds-frontend-lint (${step}).`)
    } else if (dest === OVERRIDES_FILE) {
      continue // checked below
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
  if (gi.some((l) => GITIGNORE_BLOCKERS.includes(l.trim()))) bad('.gitignore ignores all of .vscode (setup step 5).')
  else if (!gi.join('\n').includes(GITIGNORE_BLOCK.join('\n')))
    bad('.gitignore is missing the VS Code lines (setup step 5).')
  else ok('.gitignore')

  await checkOverrides(ok, bad)

  if (problems) {
    console.log(`\n✖ ${problems} problem(s). See the ds-frontend-lint README for the expected setup.\n`)
    process.exit(1)
  }
  console.log('\n✓ All standards in place.\n')
}

// ---------------- overrides ----------------

const severity = (v) => {
  const s = Array.isArray(v) ? v[0] : v
  return { 0: 'off', 1: 'warn', 2: 'error' }[s] ?? s
}

const isMigration = (o) => /^migration:/i.test(o.name)

// Checks the shape of eslint.overrides.mjs and lists every override, so silenced rules stay visible.
async function checkOverrides(ok, bad) {
  const file = path.join(CWD, OVERRIDES_FILE)
  if (!fs.existsSync(file)) return // already reported as missing

  let overrides
  try {
    overrides = (await import(pathToFileURL(file).href)).default
  } catch (e) {
    return bad(`${OVERRIDES_FILE} could not be loaded: ${e.message}`)
  }
  if (!Array.isArray(overrides)) return bad(`${OVERRIDES_FILE} must export an array: export default [ ... ]`)
  if (!overrides.length) return ok(`${OVERRIDES_FILE} (no overrides)`)

  let failed = false
  const fail = (m) => {
    failed = true
    bad(m)
  }
  const lines = []
  overrides.forEach((o, i) => {
    const label = `${OVERRIDES_FILE} entry ${i + 1}`
    if (!o || typeof o !== 'object' || Array.isArray(o)) return fail(`${label} must be an object.`)
    if (typeof o.name !== 'string' || !OVERRIDE_NAME.test(o.name))
      return fail(
        `${label} needs a name that starts with "migration:" or "permanent:", then says why. ` +
          `Example: name: 'migration: legacy pages still use var'` +
          (o.name ? ` (it has: '${o.name}')` : ''),
      )
    if (o.rules && 'prettier/prettier' in o.rules)
      fail(`${label} (${o.name}) changes prettier/prettier. Formatting is shared: change it in ds-frontend-lint.`)

    const bySeverity = {}
    for (const [rule, v] of Object.entries(o.rules ?? {})) (bySeverity[severity(v)] ??= []).push(rule)
    const what = Object.entries(bySeverity).map(([s, rules]) => `${rules.join(', ')} → ${s}`)
    const globals = Object.keys(o.languageOptions?.globals ?? {})
    if (globals.length) what.push(`adds globals ${globals.join(', ')}`)
    const globalIgnore = o.ignores && !o.files && !o.rules
    const where = o.files ? ` in ${o.files.flat().join(', ')}` : ' in all files'
    const detail = globalIgnore ? `skips ${o.ignores.join(', ')}` : `${what.join('; ') || 'other settings'}${where}`
    lines.push(`      ${o.name}`, `        ${detail}`)
    if (isMigration(o) && o.rules && !o.files)
      lines.push('        ⚠ applies to the whole project. Scope it to the legacy code with "files".')
  })

  if (!failed) {
    const migrations = overrides.filter(isMigration).length
    ok(`${OVERRIDES_FILE}: ${overrides.length} override(s), ${migrations} for migration`)
    console.log(lines.join('\n'))
  }
}

// ---------------- main ----------------

const cmd = process.argv[2]

if (cmd === 'check') await check()
else {
  console.log(`
${HEADER}

Usage:
  npx ds-frontend-lint check

check
  - Checks that this project's lint and format setup matches the standard.
  - Read-only: it never changes files.
  - Run it with "npm run verify:ds".

Docs: https://github.com/Innovate-Inc/ds-frontend-lint
`)
  process.exit(cmd ? 1 : 0)
}
