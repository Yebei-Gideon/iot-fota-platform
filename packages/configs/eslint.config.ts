import type { OptionsConfig } from '@antfu/eslint-config'
import antfu from '@antfu/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwindcss from 'eslint-plugin-tailwindcss'

// Type options safely using Antfu's native configuration structure
export function createBaseConfig(options: OptionsConfig = {}) {
  return antfu({
    // Core Languages & Framework Options
    typescript: true,
    vue: true,

    // Data & Markup Formatters
    jsonc: true,
    yaml: true,
    toml: true,
    markdown: true,

    // Embedded Stylesheet & Document Layout Formatters
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },

    // Base Code Spacing Principles
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },

    ignores: ['**/tsconfig.json', 'dist/**/*', '.nuxt/**/*'],
    ...options,
  }, {
    // Global Layers: Inject rules & plugins safely
    plugins: {
      'simple-import-sort': simpleImportSort,
      'tailwindcss': tailwindcss,
    },
    rules: {
      'perfectionist/sort-imports': 'off',
      'node/prefer-global/process': 'off',

      // Enforce Tailwind v4 automated class name layout sequencing
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off',
    },
  }, {
    // Code Base Target Filters
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  })
}

export const baseConfig = createBaseConfig()
export default baseConfig
