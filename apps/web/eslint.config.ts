// @ts-check
import antfu from '@antfu/eslint-config'
import * as simpleImportSort from 'eslint-plugin-simple-import-sort'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    // Enable stylistic formatting engines
    stylistic: true,

    // Explicitly configure Vue and TypeScript support layers
    vue: true,
    typescript: true,
  }, {
    // 1. GLOBAL LAYER: Inject the safe alternative sorter and disable the broken one
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Bypasses the TypeScript compiler api crash completely
      'perfectionist/sort-imports': 'off',

      // Traditional framework overrides for Vue
      'vue/multi-word-component-names': 'off',
    },
  }, {
    // 2. FILE FILTER LAYER: Run the safe import sorter on your project files
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }),
)
