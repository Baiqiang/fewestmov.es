import express from 'express'
import crypto from 'crypto'
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import user from './user'
import _if from './if'

const router = express.Router()

router.post('/logout', async (req, res, next) => {
  req.logout()
  res.json(null)
})

router.use('/user', user)
router.use('/if', _if)

export default router
