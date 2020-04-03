import express from 'express'
import crypto from 'crypto'
import config from 'config'
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import models from '../../../db'
import { formatAlgorithm, removeComment, centerLength } from '../../../libs'
import { validAlgs, maxScrambleLength, maxSkeletonLength, maxGreedy } from '../../../config/if'

const router = express.Router()
const { sequelize, InsertionFinder, RealInsertionFinder, UserInsertionFinder, Alg } = models
const TYPES = RealInsertionFinder.TYPES

router.post('/', async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    let { type = TYPES.IF, scramble = '', skeleton, algs = [], name, greedy } = req.body
    let formattedSkeleton
    scramble = String(scramble)
    skeleton = String(skeleton)
    greedy = parseInt(greedy)
    type = parseInt(type)
    if (!Object.values(TYPES).includes(type)) {
      throw {
        code: 400,
        message: 'INVALID_TYPE',
      }
    }
    if (type === TYPES.IF && scramble.length === 0) {
      throw {
        code: 400,
        message: 'INVALID_SCRAMBLE',
      }
    }
    if (type === TYPES.IF && (!Array.isArray(algs) || algs.length === 0)) {
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
    if (scramble.split(' ').length > maxScrambleLength) {
      throw {
        code: 400,
        message: 'SCRAMBLE_TOO_LONG',
      }
    }
    const cube = new Cube()
    cube.twist(new Algorithm(scramble))
    cube.twist(new Algorithm(removeComment(skeleton)))
    const bestCube = cube.getBestPlacement()
    try {
      formattedSkeleton = formatAlgorithm(skeleton, bestCube.placement)
    } catch (e) {
      throw {
        code: 400,
        message: 'INVALID_SKELETON',
      }
    }
    if (formattedSkeleton.split(' ').length > maxSkeletonLength) {
      throw {
        code: 400,
        message: 'SKELETON_TOO_LONG',
      }
    }
    if (!req.user || greedy < 0 || greedy > maxGreedy || Number.isNaN(greedy)) {
      greedy = 2
    }
    const greedyObj = greedy === 2 ? {} : { greedy }
    // for non formatted skeleton
    const hash = crypto.createHash('md5').update(JSON.stringify(Object.assign({
      scramble,
      skeleton,
      algs
    }, greedyObj))).digest('hex')
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
    const realHash = crypto.createHash('md5').update(JSON.stringify(Object.assign({
      scramble,
      skeleton: formattedSkeleton,
      algs
    }, greedyObj))).digest('hex')
    let realInsertionFinder = await RealInsertionFinder.findOne({
      where: {
        hash: realHash
      },
      include: [Alg],
      transaction,
    })
    if (!realInsertionFinder) {
      const cornerCycles = bestCube.getCornerCycles()
      const edgeCycles = bestCube.getEdgeCycles()
      const centerCycles = centerCycleTable[bestCube.placement]
      const placement = bestCube.placement
      const parity = bestCube.hasParity()
      const totalCycles = (centerCycles > 1 ? 0 : parity * 3) + (cornerCycles + edgeCycles + centerCycles) * 2
      realInsertionFinder = await RealInsertionFinder.create({
        type,
        hash: realHash,
        version: config.version,
        scramble,
        skeleton: formattedSkeleton,
        greedy,
        totalCycles,
        cornerCycles,
        edgeCycles,
        centerCycles,
        parity,
        cycleDetail: {
          corner: bestCube.getCornerStatus(),
          edge: bestCube.getEdgeStatus(),
          center: centerCycles > 0 ? [{
            length: centerLength(centerCycles, placement)
          }] : [],
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

router.get('/latest', async (req, res, next) => {
  const ifs = await InsertionFinder.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 10
  })
  res.json(await Promise.all(ifs.map(insertionFinder => insertionFinder.getInfo())))
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
    console.log(e)
    res.sendStatus(500).json(null)
  }
})

export default router
