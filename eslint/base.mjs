// @ts-check
// Vanilla JS/TS projects, Node services, libraries.
import { defineConfig } from 'eslint/config'
import { ignores, core } from './internal/core.mjs'
import { prettier } from './internal/prettier.mjs'

// Project overrides go before prettier, which must stay last.
export const withOverrides = (overrides = []) => defineConfig(ignores, ...core, ...overrides, prettier)

export default withOverrides()
