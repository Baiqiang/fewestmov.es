import { spawn } from 'child_process'
import config from 'config'
import models from '../db'

const { User, InsertionFinder, RealInsertionFinder: RealIF, Alg } = models

const { STATUS } = RealIF

async function start() {
  async function run() {
    const IFs = await RealIF.findAll({
      where: {
        status: STATUS.WAITING,
      },
      order: [
        ['created_at']
      ],
      limit: 10,
    })
    for (const realIF of IFs) {
      console.log(`Start to compute ${realIF.hash}`)
      if (realIF.totalCycles > config.get('if.maxCycles')) {
        realIF.status = STATUS.FINISHED
        await realIF.save()
        console.log(`Exceeded max cycles: ${config.get('if.maxCycles')}`)
        continue
      }
      realIF.status = STATUS.COMPUTING
      await realIF.save()
      const algs = await realIF.getAlgs()
      try {
        const result = await new Promise((resolve, reject) => {
          const args = [
            '-s',
            '-j',
            '--json',
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
        console.log(`Finished computing ${realIF.hash}`)
      } catch (e) {
        console.error(e)
      }
    }
    run()
  }
  run()
}

start()
