import {baseConfig} from '@fota/configs'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  baseConfig,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  }
)
