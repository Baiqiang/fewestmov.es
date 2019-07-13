import passport from 'passport'
import { OAuth2Strategy } from 'passport-oauth'
import config from 'config'
import axios from 'axios'

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
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use('wca', new WCAOAuth2Strategy({
  authorizationURL: auth.authorizationUrl,
  tokenURL: auth.tokenUrl,
  clientID: auth.clientId,
  clientSecret: auth.clientSecret,
  scope: auth.scope,
  callbackURL: `http${server.has('https') ? 's' : ''}://${server.host}:${server.port}/auth/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))

export default passport
