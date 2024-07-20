// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' }
      ],
      script: [
        { 
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
          crossorigin: 'anonymous',
        },
        {
          src: 'https://kit.fontawesome.com/e5ccf98c71.js',
          crossorigin: 'anonymous',
        }
      ],
    },
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'lightgallery/css/lightgallery.css',
    '@/assets/css/style.css',
    '@/assets/css/responsive.css',
  ],
  components: [{ path: '~/components', pathPrefix: false }],
  plugins: [
    '~/plugins/js-cookie.ts',
    '~/plugins/pinia.ts',
    { src: '~/plugins/vee-validate.ts', ssr: true },
  ],
  build: {
    transpile: ['vee-validate']
  },
})
