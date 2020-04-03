import { spawn } from 'child_process'
import Queue from 'better-queue'
import { maxCycles } from '../config/if'
import models from '../db'

const { RealInsertionFinder: RealIF, Sequelize: { Op } } = models

const { STATUS, TYPES } = RealIF

async function start() {
  const processFn = async (IFs, cb) => {
    await computeIFs(IFs)
    cb(null)
  }
  const normalQueue = new Queue(processFn)

  normalQueue.push(await getIFs({
    type: TYPES.IF,
    greedy: {
      [Op.lte]: 2
    }
  }))

  normalQueue.on('drain', async () => {
    normalQueue.push(await getIFs({
      type: TYPES.IF,
      greedy: {
        [Op.lte]: 2
      }
    }))
  })

  const bigQueue = new Queue(processFn)

  bigQueue.push(await getIFs({
    type: TYPES.IF,
    greedy: {
      [Op.gt]: 2
    }
  }))

  bigQueue.on('drain', async () => {
    bigQueue.push(await getIFs({
      type: TYPES.IF,
      greedy: {
        [Op.gt]: 2
      }
    }))
  })

  const sfQueue = new Queue(processFn)

  sfQueue.push(await getIFs({
    type: TYPES.SF
  }))

  sfQueue.on('drain', async () => {
    sfQueue.push(await getIFs({
      type: TYPES.SF
    }))
  })

}

function getIFs(condition) {
  return RealIF.findAll({
    where: {
      status: STATUS.WAITING,
      ...condition
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
    realIF.status = STATUS.COMPUTING
    await realIF.save()
    if (realIF.type === TYPES.IF) {
      if (realIF.totalCycles > maxCycles) {
        realIF.status = STATUS.FINISHED
        await realIF.save()
        console.log(`Exceeded max cycles: ${maxCycles}`)
        continue
      }
      await callIF(realIF)
    } else {
      await callSF(realIF)
    }
    console.log(`Finished computing ${realIF.hash}`)
  }
}

async function callSF(realIF) {
  try {
    const result = await new Promise((resolve, reject) => {
      const args = [
        '-ij',
        '--json',
        '--all-algs',
      ]
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
      child.stdin.write(`${realIF.skeleton}\n`)
    })
    realIF.result = result
    realIF.status = STATUS.FINISHED
    await realIF.save()
  } catch (e) {
    console.error(e)
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
