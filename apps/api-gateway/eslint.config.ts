import {createBaseConfig} from '@fota/configs'

export default createBaseConfig({
    typescript: {
        tsconfigPath: './tsconfig.json',
    },
}).append(
    {
        rules: {
            'no-console': 'off',
            'no-useless-constructor': 'off',
            'no-empty-function': 'off',
            '@typescript-eslint/no-useless-constructor': 'off',
            'ts/no-parameter-properties': 'off',
        },
    },
    {
        files: ['src/**/*.ts'],
        rules: {
            'ts/consistent-type-imports': ['error', {
                prefer: 'type-imports',
                disallowTypeAnnotations: false,
            }],
        },
    }
)
