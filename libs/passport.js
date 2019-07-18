import passport from 'passport'
import { OAuth2Strategy } from 'passport-oauth'
import config from 'config'
import axios from 'axios'
import models from '../db'

const { User, UserRole } = models

const auth = config.get('auth')
const server = config.get('server')

class WCAOAuth2Strategy extends OAuth2Strategy {
  async userProfile(token, done) {
    try {
      const profile = (await axios.get(auth.userinfoUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data.me
      done(null, profile)
    } catch (e) {
      done(e)
    }
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id)
  await done(null, user)
})

passport.use('wca', new WCAOAuth2Strategy({
  authorizationURL: auth.authorizationUrl,
  tokenURL: auth.tokenUrl,
  callbackURL: auth.callbackUrl,
  clientID: auth.clientId,
  clientSecret: auth.clientSecret,
  scope: auth.scope,
}, async (accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))

export default passport
