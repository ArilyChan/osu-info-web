import { resolve } from 'path'
import packageJSON from './package.json'
// eslint-disable-next-line nuxt/no-cjs-in-config
export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700', defer: true }
    ]
  },

  /*
  ** Configuration for @nuxtjs/pwa
  ** https://developer.mozilla.org/en-US/docs/Web/Manifest
  */
  manifest: {
    name: 'Vue Argon Design',
    short_name: 'Argon Design',
    description: 'Vue Argon Design System for Nuxt',
    theme_color: '#172b4d'
  },

  meta: {
    // apple-mobile-web-app-capable=yes
    // https://medium.com/@firt/dont-use-ios-web-app-meta-tag-irresponsibly-in-your-progressive-web-apps-85d70f4438cb
    mobileAppIOS: true,
    appleStatusBarStyle: '#172b4d'
  },
  // serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],
  /*
  ** Global CSS
  */
  css: [
    '~assets/argon/vendor/nucleo/css/nucleo.css',
    '@fortawesome/fontawesome-free/css/all.css',
    // '~assets/argon/scss/argon.scss',
    // 'bootstrap-vue/dist/bootstrap-vue.css',
    '~assets/transitions.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/argon/argon-kit',
    // { src: '~/plugins/apex-chart', mode: 'client' },
    // { src: '~/plugins/fullpage-vue.js', mode: 'client' },
    '~/plugins/osu-assets/index.js',
    '~/plugins/osu-popup-user/index.js',
    '~/plugins/vue-flag.js',
    '~/plugins/light-timeline.js',
    '~/plugins/moment.js'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // 'nuxt-purgecss',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/i18n', {
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected'
        // onlyOnRoot: true // recommended
      }
    }],
    '@nuxtjs/proxy',
    // // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    // Doc: https://github.com/nuxt/content
    // '@nuxt/content',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    ['bootstrap-vue/nuxt', {
      bootstrapCSS: false
      // bootstrapVueCSS: false
    }]
    // '@nuxtjs/pwa'
  ],
  i18n: {
    locales: [
      { code: 'gb', iso: 'en-GB', file: 'en-GB.json', dir: 'ltr' },
      { code: 'us', iso: 'en-US', file: 'en-US.json', dir: 'ltr' },
      { code: 'cn', iso: 'zh-CN', file: 'zh-CN.json', dir: 'ltr' }
    ],
    defaultLocale: 'gb',
    langDir: 'locales/',
    lazy: true,
    strategy: 'prefix_and_default',
    vueI18n: {
      fallbackLocale: 'gb'
    }
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: '/'
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: `http://localhost:${process.env.PORT || 3000}`
    }
  },

  loading: {
    color: 'white',
    height: '2px'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: '/'
  },

  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    analyze: true,
    extend (config, { isDev, isClient }) {
      // Web Worker support
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
        exclude: /(node_modules)/
      })
      config.node = {
        fs: 'empty'
      }
      config.resolve.alias.vue = 'vue/dist/vue.common'
    },
    transpile: ['js-bbcode-parser']
  },
  srcDir: 'client/',
  telemetry: false,
  alias: {
    ...Object.entries(packageJSON?._moduleAliases ?? {}).reduce((acc, [k, v]) => { acc[k] = resolve(v); return acc }, {})
  },
  proxy: {
    // see Proxy section
    '/api': process.env.API_SCHEME?.startsWith('unix')
      ? {
        changeOrigin: false,
        target: { socketPath: process.env.API_LISTEN }
      }
      : {
        changeOrigin: false,
        target: `${process.env.API_SCHEME}${process.env.API_DOMAIN}:${process.env.API_LISTEN}`
      }
  },
  server: {
    host: '0' // default: localhost
  },
  router: {
    prefetchLinks: false
  }
}
