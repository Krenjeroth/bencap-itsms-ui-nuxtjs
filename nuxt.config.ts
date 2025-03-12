// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-03-12",
  devtools: { enabled: false },
  ssr: false,
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "author", content: "Krenjer Jan J. Sapitola" }],
    },
  },
  devServer: {
    host: "itsms",
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
  ],
  sanctum: {
    baseUrl: "http://itsms:80", // Laravel API
    redirect: {
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
});
