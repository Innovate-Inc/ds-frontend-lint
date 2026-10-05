// @ts-check
// Vanilla JS/TS projects, Node services, libraries.
import { defineConfig } from 'eslint/config'
import { ignores, core } from './internal/core.mjs'
import { prettier } from './internal/prettier.mjs'

export default defineConfig(ignores, ...core, prettier)
