import { Algorithm } from 'insertionfinder'
import { perPage } from '../config/if'

export function calcMarks(skeleton, insertion) {
  if (!Array.isArray(skeleton)) {
    skeleton = skeleton.split(' ')
  }
  if (!Array.isArray(insertion)) {
    insertion = insertion.split(' ')
  }
  const rotations = skeleton.filter(twist => 'xyz'.indexOf(twist.charAt(0)) > -1)
  if (rotations.length) {
    skeleton = skeleton.slice(0, skeleton.length - rotations.length)
    insertion = formatAlgorithm([...rotations, ...insertion]).split(' ')
  }
  if (insertion.length === 1 && insertion[0] === '') {
    insertion = []
  }
  const skeletonMarks = skeleton.map(r => MARKS.NONE)
  const insertionMarks = insertion.map(r => MARKS.NONE)
  let i = skeleton.length - 1
  let j = 0
  while (i >= 0 && j < insertion.length) {
    const a = skeleton[i]
    const b = insertion[j]
    if ('xyz'.indexOf(b.charAt(0)) > -1) {
      break
    }
    const alg = new Algorithm(`${a} ${b}`)
    alg.clearFlags()
    switch (alg.twists.length) {
      case 0:
        if (skeletonMarks[i + 1] !== MARKS.CANCELLED && skeletonMarks[i + 1] !== undefined) {
          const swappableA = isSwappable(a, skeleton[i + 1])
          if (!swappableA || skeletonMarks[i + 2] !== MARKS.CANCELLED && skeletonMarks[i + 2] !== undefined) {
            i = -1
            break
          }
        }
        // cancelled
        skeletonMarks[i] = MARKS.CANCELLED
        insertionMarks[j] = MARKS.CANCELLED
        if (skeletonMarks[i + 1] !== MARKS.CANCELLED && skeletonMarks[i + 1] !== undefined) {
          i = -1
          break
        }
        i--
        j++
        break
      case 1:
        if (skeletonMarks[i + 1] === MARKS.MERGED || skeletonMarks[i + 1] === MARKS.NONE) {
          const swappableA = isSwappable(a, skeleton[i + 1])
          if (!swappableA || skeletonMarks[i + 2] !== MARKS.CANCELLED && skeletonMarks[i + 2] !== undefined) {
            i = -1
            break
          }
        }
        // merged
        skeletonMarks[i] = MARKS.MERGED
        insertionMarks[j] = MARKS.MERGED
        i--
        j++
        break
      case 2:
        // check if swappable
        const swappableA = isSwappable(a, skeleton[i - 1])
        const swappableB = isSwappable(b, insertion[j + 1])
        if (!swappableA && !swappableB) {
          // nonthing can be cancelled
          i = -1
        } else if (swappableA && !swappableB) {
          i--
        } else if (!swappableA && swappableB) {
          j++
        } else {
          const algA = new Algorithm(`${a} ${insertion[j + 1]}`)
          const algB = new Algorithm(`${skeleton[i - 1]} ${b}`)
          algA.clearFlags()
          algB.clearFlags()
          switch (algA.twists.length) {
            case 2:
              // nothing cancelled after swap
              i = -1
              break
            case 1:
              // merged
              skeletonMarks[i] = MARKS.MERGED
              insertionMarks[j + 1] = MARKS.MERGED
              break
            case 0:
              // cancelled
              skeletonMarks[i] = MARKS.CANCELLED
              insertionMarks[j + 1] = MARKS.CANCELLED
              break
          }
          switch (algB.twists.length) {
            case 2:
              // nothing cancelled after swap
              i = -1
              break
            case 1:
              // merged
              skeletonMarks[i - 1] = MARKS.MERGED
              insertionMarks[j] = MARKS.MERGED
              break
            case 0:
              // cancelled
              skeletonMarks[i - 1] = MARKS.CANCELLED
              insertionMarks[j] = MARKS.CANCELLED
              break
          }
          if (skeletonMarks[i] != MARKS.CANCELLED || skeletonMarks[i - 1] != MARKS.CANCELLED) {
            i = -1
            break;
          }
          i -= 2
          j += 2
        }
        break
    }
  }
  return [[...skeletonMarks, ...rotations.map(r => MARKS.NONE)], insertionMarks]
}

function formatAlgorithm(string) {
  if (Array.isArray(string)) {
    string = string.join(' ')
  }
  // remove comments
  string = string.replace(/[‘’`]/g, "'")
  string = string.split('\n').map(s => s.split('//')[0]).join('')
  const algorithm = new Algorithm(string)
  algorithm.clearFlags()
  algorithm.normalize()
  return algorithm.toString()
}

function isSwappable(a, b) {
  if (!a || !b) {
    return false
  }
  const alg = new Algorithm(`${a} ${b}`)
  return alg.twists[0] >>> 3 === alg.twists[1] >>> 3
}

function isSameFace(a, b) {
  return a && b && a.charAt(0) === b.charAt(0)
}

export { isSwappable, isSameFace, formatAlgorithm }

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
