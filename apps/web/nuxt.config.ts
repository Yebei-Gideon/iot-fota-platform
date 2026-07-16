// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    externals: {
      inline: ['@fota/logger', '@fota/types'],
    },
  },

  vite: {
    build: {
      commonjsOptions: {
        include: [/packages/, /node_modules/],
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: {
        semi: true,
        quotes: 'double',
        indent: 'tab',
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
      },
    },
  },
})
