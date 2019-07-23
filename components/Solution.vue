<template>
  <b-card
    class="solution mb-3"
  >
    <dl class="row mb-0">
      <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.solutions.insertions') }}</dt>
      <dd class="col-sm-12 col-md-8 col-lg-9">{{ insertions.length }}</dd>
      <template v-for="({ formattedSkeleton, formattedInsertion }, i) in insertions">
        <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.skeleton.label') }}</dt>
        <dd class="col-sm-12 col-md-8 col-lg-9 mb-0">
          <pre v-html="formattedSkeleton"></pre>
        </dd>
        <dt class="col-sm-12 col-md-4 col-lg-3">{{ getInsertionSymble(i) }}</dt>
        <dd class="col-sm-12 col-md-8 col-lg-9">
          <pre class="insertion" v-html="formattedInsertion"></pre>
        </dd>
      </template>
      <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.solutions.final') }}</dt>
      <dd class="col-sm-12 col-md-8 col-lg-9">
        <pre>{{ final_solution }}</pre>
      </dd>
      <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.solutions.cancellation') }}</dt>
      <dd class="col-sm-12 col-md-8 col-lg-9 mb-0">{{ cancellation }}</dd>
    </dl>
  </b-card>
</template>

<script>
const emojis = ['😁', '😍', '😂', '🤔', '😈', '👻', '👽', '😡', '😮'].sort(() => Math.random() - 0.5)

import { Algorithm } from 'insertionfinder'
import { formatAlgorithm, calcMarks, MARKS, isSameFace, isSwappable } from '~/libs'

export default {
  props: ['solution'],
  data() {
    return {
    }
  },
  computed: {
    insertions() {
      return this.solution.insertions.map(({ skeleton, insertion, insert_place: place}, index, insertions) => {
        let formattedSkeleton = skeleton.split(' ')
        let formattedInsertion = insertion.split(' ')
        let nextSkeleton = insertions[index + 1] && insertions[index + 1].skeleton || this.final_solution
        let firstPart = formattedSkeleton.slice(0, place)
        let lastPart = formattedSkeleton.slice(place)
        const rotations = formattedInsertion.filter(notation => 'xyz'.indexOf(notation.charAt(0)) > -1)
        const cancelled = formattedSkeleton.length + formattedInsertion.length - rotations.length - nextSkeleton.split(' ').length
        // calulate marks
        const [firstMarks] = calcMarks(firstPart, formatAlgorithm([...formattedInsertion, ...lastPart]))
        const [, lastMarks] = calcMarks([formatAlgorithm([...firstPart, ...formattedInsertion.slice(0, formattedInsertion.length - rotations.length)]), ...rotations].join(' '), lastPart)
        const [, firstInsertionMarks] = calcMarks(firstPart, insertion)
        const [lastInsertionMarks] = calcMarks(insertion, lastPart)
        const insertionMarks = firstInsertionMarks.map((mark, i) => {
          const markB = lastInsertionMarks[i]
          if (mark == MARKS.NONE || markB == MARKS.NONE) {
            return mark + markB
          }
          // find the index of conflict
          let twist = formattedInsertion[i]
          let j = firstPart.length - 1 - i
          if (!isSameFace(firstPart[j], twist)) {
            if (isSwappable(firstPart[j], firstPart[j - 1])) {
              j = j - 1
            } else {
              j = j + 1
            }
          }
          twist = formatAlgorithm([...rotations.map(this.inverse).reverse(), twist])
          let k = formattedInsertion.length - rotations.length - 1 - i
          if (!isSameFace(lastPart[k], twist)) {
            if (isSwappable(lastPart[k], lastPart[k - 1])) {
              k = k - 1
            } else {
              k = k + 1
            }
          }
          // one side cancelled, the other side is nothing
          if (mark === MARKS.CANCELLED) {
            firstMarks[j] = MARKS.CANCELLED
            lastMarks[k] = MARKS.NONE
            return markB
          }
          if (markB === MARKS.CANCELLED) {
            firstMarks[j] = MARKS.NONE
            lastMarks[k] = MARKS.CANCELLED
            return markB
          }
          // both sides merged, let's check the final result
          const alg = new Algorithm([firstPart[j], formattedInsertion[i], ...rotations, lastPart[k]].join(' '))
          alg.clearFlags()
          switch (alg.twists.length) {
            case 0:
              return firstMarks[j] = lastMarks[k] = MARKS.CANCELLED
            case 1:
              return firstMarks[j] = lastMarks[k] = MARKS.MERGED
          }
        })
        // sort skeleton
        this.sortSkeleton(firstPart, firstMarks)
        this.sortSkeleton(lastPart, lastMarks, true)
        let marks = [
          ...firstMarks,
          MARKS.NONE,
          ...lastMarks,
        ]
        formattedSkeleton = [...firstPart, `${this.getInsertionSymble(index)}`, ...lastPart]
        this.applyMarks(formattedSkeleton, marks)
        formattedSkeleton = formattedSkeleton.join(' ')
        // insertion
        this.applyMarks(formattedInsertion, insertionMarks)
        formattedInsertion = [...formattedInsertion, `(${formattedInsertion.length - rotations.length}-${cancelled})`].join(' ')
        return {
          skeleton,
          formattedSkeleton,
          insertion,
          formattedInsertion,
          place,
        }
      })
    },
    cancellation() {
      return this.solution.cancellation
    },
    final_solution() {
      return this.solution.final_solution
    },
  },
  methods: {
    sortSkeleton(skeleton, marks, inverse = false) {
      for (let i = 0; i < marks.length - 1; i++) {
        const j = i + 1
        if ((marks[i] > marks[j] && !inverse) ||( marks[i] < marks[j] && inverse)) {
          [marks[i], marks[j]] = [marks[j], marks[i]];
          [skeleton[i], skeleton[j]] = [skeleton[j], skeleton[i]];
        }
      }
    },
    inverse(r) {
      const f = r.charAt(0)
      switch (r.charAt(1)) {
        case '':
          return `${f}'`
        case "'":
          return f
        case '2':
          return r
      }
    },
    applyMarks(algs, marks) {
      for (let i = 0; i < marks.length; i++) {
        algs[i] = this.applyMark(algs[i], marks[i])
      }
    },
    applyMark(alg, mark) {
      switch (mark) {
        case MARKS.MERGED:
          return `<span class="merged-move">${alg}</span>`
        case MARKS.CANCELLED:
          return `<span class="cancelled-move">${alg}</span>`
        case MARKS.MERGED_OR_CANCELLED:
          return `<span class="cancelled-move merged-move">${alg}</span>`
        default:
          return alg
      }
    },
    getInsertionSymble(index) {
      return emojis[index] || `@${index + 1}`
    }
  }
}
</script>

<style lang="less">
.solution {
  dt {
    @media (min-width: 768px) {
      text-align: right;
    }
  }
  .merged-move {
    background-color: #11ddf7;
  }
  .cancelled-move {
    position: relative;
    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      left: -3px;
      right: -3px;
      top: 50%;
      height: 2px;
      background-color: rgba(255, 0, 0, 0.5);
      transform: translateY(-1px);
    }
  }
}
</style>
