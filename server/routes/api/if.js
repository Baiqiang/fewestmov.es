import express from 'express'
import crypto from 'crypto'
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import models from '../../../db'
import { formatAlgorithm } from '../../../libs'
import { validAlgs } from '../../../config/if'

const router = express.Router()
const { sequelize, InsertionFinder, RealInsertionFinder, UserInsertionFinder, Alg } = models

router.post('/', async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    let { scramble, skeleton, algs, name } = req.body
    let formattedSkeleton
    scramble = String(scramble)
    if (scramble.length === 0) {
      throw {
        code: 400,
        message: 'INVALID_SCRAMBLE',
      }
    }
    skeleton = String(skeleton)
    if (!Array.isArray(algs) || algs.length === 0) {
      throw {
        code: 400,
        message: 'INVALID_ALGS'
      }
    }
    for (let alg of algs) {
      if (validAlgs.indexOf(alg) === -1) {
        throw {
          code: 400,
          message: 'INVALID_ALGS'
        }
      }
    }
    algs.sort()
    try {
      scramble = formatAlgorithm(scramble)
    } catch (e) {
      throw {
        code: 400,
        message: 'INVALID_SCRAMBLE',
      }
    }
    if (scramble.split(' ').length > 50) {
      throw {
        code: 400,
        message: 'SCRAMBLE_TOO_LONG',
      }
    }
    try {
      formattedSkeleton = formatAlgorithm(skeleton)
    } catch (e) {
      throw {
        code: 400,
        message: 'INVALID_SKELETON',
      }
    }
    if (formattedSkeleton.split(' ').length > 50) {
      throw {
        code: 400,
        message: 'SKELETON_TOO_LONG',
      }
    }
    // for non formatted skeleton
    const hash = crypto.createHash('md5').update(JSON.stringify({
      scramble,
      skeleton,
      algs
    })).digest('hex')
    const [insertionFinder] = await InsertionFinder.findOrCreate({
      where: {
        hash,
        skeleton,
      },
      transaction,
    })
    if (req.user) {
      let userIF = await UserInsertionFinder.findOne({
        where: {
          insertion_finder_id: insertionFinder.id,
          user_id: req.user.id
        },
        transaction,
        paranoid: false
      })
      if (!userIF) {
        [userIF] = await insertionFinder.addUser(req.user.id, { transaction })
        userIF.name = name || ''
        await userIF.save({ transaction })
      } else {
        userIF.name = name || ''
        userIF.deletedAt = null
        userIF.setDataValue('createdAt', new Date)
        await userIF.restore({ transaction })
      }
    }
    // for formatted skeleton
    const realHash = crypto.createHash('md5').update(JSON.stringify({
      scramble,
      skeleton: formattedSkeleton,
      algs
    })).digest('hex')
    let realInsertionFinder = await RealInsertionFinder.findOne({
      where: {
        hash: realHash
      },
      include: [Alg],
      transaction,
    })
    if (!realInsertionFinder) {
      const cube = new Cube()
      cube.twist(new Algorithm(scramble))
      cube.twist(new Algorithm(formattedSkeleton))
      const bestCube = cube.getBestPlacement()
      const cornerCycles = bestCube.getCornerCycles()
      const edgeCycles = bestCube.getEdgeCycles()
      const centerCycles = centerCycleTable[bestCube.placement]
      const parity = bestCube.hasParity()
      const totalCycles = (centerCycles > 1 ? 0 : parity * 3) + (cornerCycles + edgeCycles + centerCycles) * 2
      realInsertionFinder = await RealInsertionFinder.create({
        hash: realHash,
        scramble,
        skeleton: formattedSkeleton,
        totalCycles,
        cornerCycles,
        edgeCycles,
        centerCycles,
        parity,
        cycleDetail: {
          corner: bestCube.getCornerStatus(),
          edge: bestCube.getEdgeStatus(),
        },
        Algs: algs.map(name => ({name})),
      }, {
        include: [Alg],
        transaction,
      })
    }
    await insertionFinder.setRealInsertionFinder(realInsertionFinder, { transaction })
    await transaction.commit()
    res.json(await insertionFinder.getInfo())
  } catch (e) {
    console.log(e)
    await transaction.rollback()
    if (e.code) {
      res.status(e.code).json(e)
    } else {
      res.sendStatus(500)
    }
  }
})

router.get('/:hash', async (req, res, next) => {
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
    res.json(await insertionFinder.getInfo())
  } catch (e) {
    res.sendStatus(500)
  }
})

export default router
