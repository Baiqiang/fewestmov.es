import express from 'express'
import models from '../../../../db'
import user from './user'
import _if from './if'

const router = express.Router()
const { User, UserRole } = models

router.use(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(null)
  }
  if (!await req.user.hasRole(UserRole.ADMIN)) {
    return res.status(403).json(null)
  }
  await next()
})

router.use('/user', user)
router.use('/if', _if)

export default router
