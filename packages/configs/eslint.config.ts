import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // Enable TypeScript and styling rules automatically
    typescript: true,
    vue: true,
    stylistic: true,
  },
  // Add global workspace overrides here
  {
    rules: {
      'no-console': 'warn',
    },
  },
)
