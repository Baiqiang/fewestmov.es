import { spawn } from 'child_process'
import Queue from 'better-queue'
import { maxCycles } from '../config/if'
import models from '../db'

const { User, InsertionFinder, RealInsertionFinder: RealIF, Alg, Sequelize: { Op } } = models

const { STATUS } = RealIF

async function start() {
  const normalQueue = new Queue(async (IFs, cb) => {
    await computeIFs(IFs)
    cb(null)
  })

  normalQueue.push(await getIFs({
    [Op.lte]: 2
  }))

  normalQueue.on('drain', async () => {
    normalQueue.push(await getIFs({
      [Op.lte]: 2
    }))
  })

  const bigQueue = new Queue(async (IFs, cb) => {
    await computeIFs(IFs)
    cb(null)
  })

  bigQueue.push(await getIFs({
    [Op.gt]: 2
  }))

  bigQueue.on('drain', async () => {
    bigQueue.push(await getIFs({
      [Op.gt]: 2
    }))
  })
}

function getIFs(greedy) {
  return RealIF.findAll({
    where: {
      status: STATUS.WAITING,
      greedy
    },
    order: [
      ['created_at']
    ],
    limit: 10,
  })
}

async function computeIFs(IFs) {
  for (const realIF of IFs) {
    console.log(`Start to compute ${realIF.hash}`)
    if (realIF.totalCycles > maxCycles) {
      realIF.status = STATUS.FINISHED
      await realIF.save()
      console.log(`Exceeded max cycles: ${maxCycles}`)
      continue
    }
    realIF.status = STATUS.COMPUTING
    await realIF.save()
    await callIF(realIF)
    console.log(`Finished computing ${realIF.hash}`)
  }
}

async function callIF(realIF) {
  try {
    const algs = await realIF.getAlgs()
    const result = await new Promise((resolve, reject) => {
      const args = [
        '-s',
        '-j',
        '--json',
        '--greedy-threshold=' + realIF.greedy,
      ]
      algs.forEach(alg => {
        args.push('-a')
        args.push(alg.name)
      })
      const output = {}
      const child = spawn('insertionfinder', args)
      console.log(`Run command insertionfinder ${args.join(' ')}`)
      for (const stream of ['stdout', 'stderr']) {
        output[stream] = []
        child[stream].on('data', data => output[stream].push(data))
      }
      child.on('error', reject)
      child.on('close', () => {
        if (output.stdout.length) {
          resolve(JSON.parse(output.stdout.join('')))
        } else {
          reject(output.stderr.join(''))
        }
      })
      child.stdin.write(`${realIF.scramble}\n${realIF.skeleton}\n`)
    })
    realIF.result = result
    realIF.status = STATUS.FINISHED
    await realIF.save()
  } catch (e) {
    console.error(e)
  }
}

start()
