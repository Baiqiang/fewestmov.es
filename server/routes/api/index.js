import express from 'express'
import crypto from 'crypto'
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import user from './user'
import _if from './if'
import admin from './admin'

const router = express.Router()

router.post('/logout', async (req, res, next) => {
  req.logout()
  res.json(null)
})

router.use('/user', user)
router.use('/if', _if)
router.use('/admin', admin)

export default router
