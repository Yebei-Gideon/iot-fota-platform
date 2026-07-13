import antfu from '@antfu/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu({
  stylistic: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  // Automatically ignores JSON tab formats or built artifacts
  ignores: ['**/tsconfig.json', 'dist/**/*', 'eslint.config.ts'],
}, {
  // Global block
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    // Disable the broken built-in sorting engine
    'perfectionist/sort-imports': 'off',

    // Allow standard Node.js global variables like process
    'node/prefer-global/process': 'off',

    // Allow standard console commands for server initialization logs
    'no-console': 'off',

    // NestJS dependency injection bypasses
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'ts/no-parameter-properties': 'off',
  },
}, {
  // Application block
  files: ['src/**/*.ts'],
  rules: {
    // Enable the safe alternative sorter on application files
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // NestJS Decorator type support
    'ts/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      disallowTypeAnnotations: false,
    }],
  },
})
