import express from 'express'
import passport from 'passport'

const router = express.Router()

router.use('/callback', async (req, res, next) => {
  const app = req.app
  const nuxt = app.nuxt
  passport.authenticate('wca', function(err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect('/login')
    }
    req.login(user, function(err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/')
    })
  })(req, res, next)
})

export default router
