import path from 'path'
import consola from 'consola'
import express from 'express'
import session from 'express-session'
import config from 'config'
import passport from '../libs/passport'
import router from './routes'
import models from '../db'

async function start() {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(session(config.get('session')))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(router)

  const { Nuxt, Builder } = require('nuxt')

  // Setup nuxt.js
  const nuxtConfig = require('../nuxt.config.js')
  nuxtConfig.rootDir = path.resolve(__dirname, '..')
  nuxtConfig.dev = process.env.NODE_ENV !== 'production'

  const nuxt = new Nuxt(nuxtConfig)
  app.nuxt = nuxt

  if (nuxtConfig.dev) {
    models.sequelize.sync()
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(nuxt.render)
  const { host, port } = nuxt.options.server
  app.listen(port)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

