export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@nuxtjs/shopify'
  ],

  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false
  },

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
  },

  googleFonts: {
    families: {
      'Work Sans': [400, 500, 600, 700]
    },
    display: 'swap',
    download: true,
    preconnect: true
  },

  image: {
    domains: ['cdn.shopify.com'],
    shopify: {
      baseURL: 'https://cdn.shopify.com'
    },
    format: ['webp'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },

  shopify: {
    name: 'callmewine-stage-uk',
    clients: {
      storefront: {
        apiVersion: '2026-04',
        publicAccessToken: '8d092a6931f29f23ceb49747fdc87da8'
      }
    }
  }
})
