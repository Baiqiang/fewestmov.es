import express from 'express'
import passport from 'passport'
import models from '../../db'

const { User, UserRole } = models
const router = express.Router()

router.use('/callback', async (req, res, next) => {
  passport.authenticate('wca', async (err, profile, info) => {
    if (err) {
      return res.redirect('/error')
    }
    if (!profile) {
      return res.redirect('/login')
    }
    try {
      const [user] = await User.findOrCreate({
        where: {
          email: profile.email,
        }
      })
      user.name = profile.name
      user.wcaId = profile.wca_id
      user.avatar = profile.avatar.url
      user.avatarThumb = profile.avatar.thumb_url
      await user.save()
      req.login(user, function(err) {
        if (err) {
          return next(err)
        }
        return res.redirect('/')
      })
    } catch (e) {
      console.log(e)
      return res.redirect('/error')
    }
  })(req, res, async (err) => {
    if (err) {
      console.log(err)
      return res.redirect('/error')
    }
    await next()
  })
})

export default router
