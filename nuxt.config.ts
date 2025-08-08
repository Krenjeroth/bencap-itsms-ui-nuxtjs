// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-03-12",
  devtools: { enabled: false },
  ssr: false,
  css: ["~/assets/styles/main.scss"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "author", content: "Krenjer Jan J. Sapitola" }],
      link: [{ rel: "icon", href: "/favicon.ico" }],
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  devServer: {
    // host: "itsms",
    host: "192.168.6.169",
    port: 8000,
  },
  modules: [
    "nuxt-auth-sanctum",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
    "@nuxt/ui",
    "dayjs-nuxt",
    "@nuxtjs/color-mode",
    "nuxt-lodash",
    "@nuxt/image",
    // "@vueuse/nuxt",
  ],
  sanctum: {
    // baseUrl: "http://itsms:80", // Laravel API: Local
    baseUrl: "http://192.168.6.169", // Laravel API: Remote
    redirect: {
      keepRequestedRoute: true,
      onAuthOnly: "/auth/login",
      onLogout: "/auth/login",
    },
    endpoints: {
      /**
       * The endpoint to send user credentials to authenticate.
       * @default '/login'
       */
      login: "/api/login",

      /**
       * The endpoint to destroy current user session.
       * @default '/logout'
       */
      logout: "/api/logout",

      /**
       * The endpoint to fetch current user data.
       * @default '/api/user'
       */
      user: "/api/user",
    },
  },
  googleFonts: {
    download: true,
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
  },
  dayjs: {
    locales: ["en", "tl-ph"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "en",
    defaultTimezone: "Asia/Manila",
  },
  ui: {
    safelistColors: ["yellow", "blue", "green", "red", "purple", "gray"],
  },
});
