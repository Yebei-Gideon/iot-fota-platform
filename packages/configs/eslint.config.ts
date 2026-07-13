import antfu from '@antfu/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export function createBaseConfig(options: Parameters<typeof antfu>[0] = {}) {
    return antfu({
        stylistic: true,
        typescript: true,
        vue: true,
        ignores: ['**/tsconfig.json', 'dist/**/*', 'eslint.config.ts', '.nuxt/**/*'],
        ...options,
    }, {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'perfectionist/sort-imports': 'off',
            'node/prefer-global/process': 'off',
        },
    }, {
        files: ['**/*.ts', '**/*.vue'],
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    })
}

// Instantiate a clean base instance to use as an exported object elsewhere
export const baseConfig = createBaseConfig()

export default baseConfig
