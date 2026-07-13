import { baseConfig } from '@fota/configs'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  baseConfig,
  {
    settings: {
      tailwindcss: {
        cssConfigPath: 'app/assets/css/main.css',
        callees: ['class', 'className'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
