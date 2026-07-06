export default defineNuxtConfig({
	modules: [
		"@nuxt/eslint",
		"@nuxt/ui",
		"@nuxt/image",
		"@nuxtjs/google-fonts",
		"@nuxtjs/shopify",
		"@nuxtjs/i18n",
	],

	css: ["~/assets/css/main.css"],
	ui: {
		colorMode: false,
	},

	routeRules: {
		"/": { prerender: true },
		"/en": { prerender: true },
		"/es": { prerender: true },
		"/fr": { prerender: true },
	},

	compatibilityDate: "2026-06-30",

	eslint: {
		config: {
			stylistic: {
				commaDangle: "never",
				braceStyle: "1tbs",
			},
		},
	},

	googleFonts: {
		families: {
			"Work Sans": [400, 500, 600, 700],
		},
		display: "swap",
		download: true,
		preconnect: true,
	},

	image: {
		domains: ["cdn.shopify.com"],
		shopify: {
			baseURL: "https://cdn.shopify.com",
		},
		format: ["webp"],
		quality: 80,
		screens: {
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
		},
	},

	shopify: {
		name: process.env.SHOPIFY_STORE_NAME,
		clients: {
			storefront: {
				apiVersion:'2026-04',
				publicAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
			},
		},
	},

	i18n: {
		locales: [
			{ code: "it", language: "it-IT", name: "Italiano", file: "it.json" },
			{ code: "en", language: "en-GB", name: "English", file: "en.json" },
			{ code: "es", language: "es-ES", name: "Español", file: "es.json" },
			{ code: "fr", language: "fr-FR", name: "Français", file: "fr.json" },
		],
		defaultLocale: "it",
		strategy: "prefix_except_default",
		langDir: "locales",
	},
});
