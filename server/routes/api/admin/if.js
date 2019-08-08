import express from 'express'
import models from '../../../../db'
import { getPagination } from '../../../../libs'

const router = express.Router()
const { InsertionFinder } = models

router.get('/', async (req, res, next) => {
  try {
    const total = await InsertionFinder.count()
    const { limit, offset } = getPagination(total, req.query.page)
    const ifs = await InsertionFinder.findAll({
      limit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    res.json({
      ifs: await Promise.all(ifs.map(insertionFinder => insertionFinder.getAdminInfo())),
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
