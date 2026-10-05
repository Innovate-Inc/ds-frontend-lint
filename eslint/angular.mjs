// @ts-check
// Angular projects. Requires the angular-eslint package in the project.
import { defineConfig } from 'eslint/config'
import angular from 'angular-eslint'
import { ignores, core } from './internal/core.mjs'
import { prettier } from './internal/prettier.mjs'

export default defineConfig(
  ignores,
  ...core,

  // Angular TypeScript
  {
    files: ['**/*.ts'],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
    },
  },

  // Angular HTML templates
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/use-track-by-function': 'warn',
      '@angular-eslint/template/attributes-order': [
        'warn',
        {
          alphabetical: false,
          order: [
            'STRUCTURAL_DIRECTIVE',
            'TEMPLATE_REFERENCE',
            'ATTRIBUTE_BINDING',
            'INPUT_BINDING',
            'TWO_WAY_BINDING',
            'OUTPUT_BINDING',
          ],
        },
      ],
    },
  },

  prettier,
)
