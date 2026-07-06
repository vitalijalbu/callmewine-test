// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxtjs/shopify'
  ],

  devtools: {
    enabled: true
  },

  shopify: {
    name: 'callmewine-stage-uk',
    clients: {
      storefront: {
        apiVersion: '2026-04',
        publicAccessToken: '8d092a6931f29f23ceb49747fdc87da8',
      },
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})