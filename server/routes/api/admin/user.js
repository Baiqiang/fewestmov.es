import express from 'express'
import models from '../../../../db'
import { getPagination } from '../../../../libs'

const router = express.Router()
const { User, UserInsertionFinder } = models

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
      users: await Promise.all(users.map(user => user.getAdminInfo())),
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

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json(null)
    }
    res.json(user)
  } catch (e) {
    console.log(e)
    if (e.code) {
      res.status(e.code).json(e)
    } else {
      res.status(500).json(e)
    }
  }
})

router.get('/:id/if', async (req, res, next) => {
  try {
    const id = req.params.id
    const total = await UserInsertionFinder.count({
      where: {
        user_id: id
      }
    })
    const { limit, offset } = getPagination(total, req.query.page)
    const userIFs = await UserInsertionFinder.findAll({
      where: {
        user_id: id
      },
      limit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    const ifs = await Promise.all(userIFs.map(userIF => userIF.getInfo()))
    res.json({
      ifs,
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
