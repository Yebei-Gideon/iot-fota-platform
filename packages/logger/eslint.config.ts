import { baseConfig } from '@fota/configs'

export default baseConfig.append({
  name: 'logger/no-console-override',
  // Scope it exactly so it cascades over the base config's TS rule block
  files: ['**/*.ts', '**/*.js'],
  rules: {
    'no-console': 'off',
  },
})
