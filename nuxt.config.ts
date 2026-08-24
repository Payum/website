// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Read by @nuxtjs/sitemap and @nuxtjs/robots through nuxt-site-config, and by
  // app.vue for the canonical URL. Override per environment with NUXT_SITE_URL.
  site: {
    url: 'https://payum.dev',
    name: 'Payum'
  },

  // The design system is dark-only — it defines no light palette — so the site
  // does not offer a light mode to switch to.
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
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

  // Code samples are the only mono text on the site and they are never
  // italic, so don't pull JetBrains Mono's italic faces into the build.
  fonts: {
    families: [
      { name: 'JetBrains Mono', provider: 'google', styles: ['normal'] }
    ]
  }
})
