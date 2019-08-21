const config = require('config')

const auth = config.get('auth')
const server = config.get('server')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Fewest Moves',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'material-design-icons/iconfont/material-icons.css',
    '~/assets/app.less',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/moment.js',
    '~/plugins/touch-events.js',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'cookie-universal-nuxt',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    ['@nuxtjs/google-analytics', {
      id: config.get('ga'),
    }],
  ],
  auth: {
    redirect: {
      callback: '/auth/callback',
    },
    cookie: false,
    defaultStrategy: 'wca',
    strategies: {
      wca: {
        _scheme: 'oauth2',
        client_id: auth.clientId,
        token_endpoint: auth.tokenUrl,
        authorization_endpoint: auth.authorizationUrl,
        userinfo_endpoint: auth.userinfoUrl,
        scope: auth.scope,
        response_type: auth.responseType,
        token_type: auth.tokenType,
      }
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: server.apiBaseUrl,
    progress: false,
  },
  router: {
    middleware: [
      'i18n'
    ]
  },
  server: {
    host: server.host,
    port: server.port,
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    extractCSS: true,
    terser: {
      terserOptions: {
        mangle: { safari10: true }
      }
    }
  }
}
