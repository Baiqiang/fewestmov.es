import { Algorithm } from 'insertionfinder'
import { perPage } from '../config/if'

export const emojis = [
  ['😡', '😭', '😰'],
  ['😑', '😒', '🙄'],
  ['😃', '😋', '😶'],
  ['😆', '😬', '😉'],
  ['😇', '😁', '😜'],
  ['😮', '🤠', '😎'],
  ['🤩', '😏', '🤗'],
  ['😍', '🤑', '😲'],
  ['👻', '👽', '👾'],
  ['😱'],
  ['😻'],
]

export function formatIFResult(data) {
  if (data.status === 2 && data.result.solutions.length > 0) {
    data.result.solutions.forEach(solution => {
      const indexes = {}
      const cancellations = []
      const insertionSymbols = []
      solution.insertions = solution.insertions.map(({ skeleton, insertion, insert_place: place }, index, insertions) => {
        let formattedSkeleton = skeleton.split(' ')
        let formattedInsertion = insertion.split(' ')
        let nextSkeleton = insertions[index + 1] && insertions[index + 1].skeleton || solution.final_solution
        let firstPart = formattedSkeleton.slice(0, place)
        let lastPart = formattedSkeleton.slice(place)
        const rotations = formattedInsertion.filter(notation => isRotation(notation))
        const cancelled = algLength(skeleton) + formattedInsertion.length - rotations.length - algLength(nextSkeleton)
        if (!indexes[cancelled]) {
          indexes[cancelled] = 0
        }
        const insertionSymbol = emojis[cancelled] && emojis[cancelled][indexes[cancelled]++] || `@${index + 1}`
        // calulate marks
        const marks = calcMarks([
          ...firstPart,
          insertion,
          ...lastPart
        ])
        applyMarks([
          firstPart,
          formattedInsertion,
          lastPart
        ], marks)
        formattedSkeleton = [...firstPart, insertionSymbol, ...lastPart].join(' ')
        formattedInsertion = [...formattedInsertion, `(${formattedInsertion.length - rotations.length}-${cancelled})`].join(' ')
        cancellations.push(cancelled)
        insertionSymbols.push(insertionSymbol)
        return {
          skeleton,
          formattedSkeleton,
          insertions: [
            {
              place,
              cancelled,
              formattedInsertion,
              insertionSymbol
            }
          ]
        }
      })
      if (solution.merged_insertions) {
        let index = 0
        solution.merged_insertions = solution.merged_insertions.map(({ skeleton, insertions }) => {
          if (insertions.length === 0) {
            return {
              skeleton,
              formattedSkeleton: skeleton,
              insertions: []
            }
          }
          const parts = []
          let formattedSkeleton = skeleton.split(' ')
          let i
          for (i = 0; i < insertions.length; i++) {
            const lastPlace = insertions[i - 1]?.insert_place || 0
            const part = formattedSkeleton.slice(lastPlace, insertions[i].insert_place)
            parts.push(part)
            insertions[i].algorithms.forEach(({ order, algorithm }) => {
              parts.push(algorithm.split(' '))
            })
          }
          parts.push(formattedSkeleton.slice(insertions[i - 1].insert_place))
          const marks = calcMarks(parts.map(part => part.join(' ')))
          applyMarks(parts, marks)
          formattedSkeleton = []
          const _insertions = []
          let j = 0, k = 0
          for (i = 0; i < insertions.length; i++) {
            formattedSkeleton.push(parts[j++].join(' '))
            insertions[i].algorithms.forEach(({ order }) => {
              const formattedInsertion = parts[j++]
              const rotations = formattedInsertion.filter(isRotation)
              const cancelled = cancellations[order + index]
              const insertionSymbol = insertionSymbols[order + index]
              _insertions.push({
                place: insertions[i].insert_place,
                cancelled,
                formattedInsertion: [...formattedInsertion, `(${formattedInsertion.length - rotations.length}-${cancelled})`].join(' '),
                insertionSymbol
              })
              formattedSkeleton.push(insertionSymbol)
            })
            k += insertions[i].algorithms.length
          }
          index += k
          formattedSkeleton.push(parts[j++].join(' '))
          return {
            skeleton,
            formattedSkeleton: formattedSkeleton.join(' ').trim(),
            insertions: _insertions
          }
        })
      }
    })
  }
}

export function calcMarks(alg) {
  if (Array.isArray(alg)) {
    alg = alg.join(' ')
  }
  return (new Algorithm(alg)).cancelMoves()
}

export function applyMarks(algs, marks) {
  let k = 0
  for (let i = 0; i < algs.length; i++) {
    const moves = algs[i]
    for (let j = 0; j < moves.length; j++) {
      // skip rotations
      if (isRotation(moves[j])) {
        continue
      }
      moves[j] = applyMark(moves[j], marks[k++])
    }
  }
}

export function applyMark(alg, mark) {
  switch (mark) {
    case MARKS.MERGED:
      return `<span class="merged-move">${alg}</span>`
    case MARKS.CANCELLED:
      return `<span class="cancelled-move">${alg}</span>`
    default:
      return alg
  }
}

export function formatAlgorithm(string, placement = 0) {
  string = removeComment(string)
  const algorithm = new Algorithm(string)
  algorithm.clearFlags(placement)
  algorithm.normalize()
  return algorithm.toString()
}

export function formatAlgorithmToArray(string) {
  return formatAlgorithm(string).split(' ').filter(a => a!='')
}

export function removeComment(string) {
  if (Array.isArray(string)) {
    string = string.join(' ')
  }
  // remove comments
  string = string.replace(/[‘’`]/g, "'")
  return string.split('\n').map(s => s.split('//')[0]).join('')
}

export function isSwappable(a, b) {
  if (!a || !b) {
    return false
  }
  const alg = new Algorithm(`${a} ${b}`)
  return alg.twists[0] >>> 3 === alg.twists[1] >>> 3
}

export function isSameFace(a, b) {
  return a && b && a.charAt(0) === b.charAt(0)
}

export function isRotation(a) {
  return a && 'xyz'.includes(a.charAt(0))
}

export function centerLength(centerCycles, placement) {
  return centerCycles === 3 ? 6 : centerCycles === 2 ? 4 : [2, 8, 10].includes(placement) ? 4 : 6
}

export function algLength(alg) {
  return alg.split(' ').filter(a => a != '').length
}

export function getPagination(total, page) {
  page = parseInt(page)
  if (Number.isNaN(page)) {
    page = 1
  }
  if (page < 1) {
    page = 1
  }
  if (page > Math.ceil(total / perPage)) {
    page = Math.ceil(total / perPage)
  }
  let offset = (page - 1) * perPage
  if (offset < 0) {
    offset = 0
  }
  return {
    limit: perPage,
    offset: offset,
  }
}

export const MARKS = {
  NONE: 0,
  MERGED: 1,
  CANCELLED: 2,
}
