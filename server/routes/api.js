import express from 'express'
import passport from 'passport'

const router = express.Router()

router.post('/logout', async (req, res, next) => {
  req.logout()
  res.json(null).end()
})

export default router
