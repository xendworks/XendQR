// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Disable Server-Side Rendering for Firebase compatibility
  ssr: false,

  app: {
    head: {
      title: 'QR Registration System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss' // Enables Tailwind CSS
  ],

  build: {
    transpile: [
      'firebase',
      'qrcode',
      'jsqr'
    ]
  },

  runtimeConfig: {
    private: {
      sendgridApiKey: process.env.SENDGRID_API_KEY
    },
   
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000'
    }
  },

  css: [
    '@/assets/css/main.css'
  ],

  // Auto-import components
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  devtools: { enabled: true },
  compatibilityDate: '2025-03-11'
})