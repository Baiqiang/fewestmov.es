import express from 'express'
import models from '../../../../db'
import { getPagination } from '../../../../libs'

const router = express.Router()
const { User } = models

router.get('/', async (req, res, next) => {
  try {
    const total = await User.count({})
    const { limit, offset } = getPagination(total, req.query.page)
    const users = await User.findAll({
      limit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    res.json({
      users,
      total,
    })
  } catch (e) {
    console.log(e)
    if (e.code) {
      res.status(e.code).json(e)
    } else {
      res.status(500).json(e)
    }
  }
})

export default router
