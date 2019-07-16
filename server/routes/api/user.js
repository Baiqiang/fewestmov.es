import express from 'express'
import crypto from 'crypto'
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import models from '../../../db'
import { formatAlgorithm, getPagination } from '../../../libs'

const router = express.Router()
const { User, UserInsertionFinder, InsertionFinder } = models

router.use(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(null)
  }
  await next()
})

router.get('/insertions', async (req, res, next) => {
  try {
    const user = req.user
    const total = await UserInsertionFinder.count({
      where: {
        user_id: user.id
      }
    })
    const { limit, offset } = getPagination(total, req.query.page)
    const userIFs = await UserInsertionFinder.findAll({
      where: {
        user_id: user.id
      },
      limit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    const insertions = await Promise.all(userIFs.map(userIF => userIF.getInfo()))
    res.json({
      insertions,
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

router.post('/insertion/:hash', async (req, res, next) => {
  const hash = req.params.hash
  const name = req.body.name
  try {
    const insertionFinder = await InsertionFinder.findOne({
      where: {
        hash
      },
    })
    if (!insertionFinder) {
      return res.status(404).json(null)
    }
    const userIF = await UserInsertionFinder.findOne({
      where: {
        insertion_finder_id: insertionFinder.id,
        user_id: req.user.id
      }
    })
    if (!userIF) {
      return res.status(404).json(null)
    }
    userIF.name = String(name)
    await userIF.save()
    res.json({
      name
    })
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

router.delete('/insertion/:hash', async (req, res, next) => {
  const hash = req.params.hash
  try {
    const insertionFinder = await InsertionFinder.findOne({
      where: {
        hash
      },
    })
    if (!insertionFinder) {
      return res.status(404).json(null)
    }
    const userIF = await UserInsertionFinder.findOne({
      where: {
        insertion_finder_id: insertionFinder.id,
        user_id: req.user.id
      }
    })
    if (!userIF) {
      return res.status(404).json(null)
    }
    await userIF.destroy()
    res.json(null)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

export default router
