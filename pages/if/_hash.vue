<template>
  <div>
    <dl class="row">
      <dt class="col-sm-12 col-md-3">{{ $t('if.scramble.label') }}</dt>
      <dd class="col-sm-12 col-md-9">
        <pre>{{ scramble }}</pre>
      </dd>
      <dt class="col-sm-12 col-md-3">{{ $t('if.skeleton.label') }}</dt>
      <dd class="col-sm-12 col-md-9">
        <pre>{{ skeleton }}</pre>
      </dd>
      <dt class="col-sm-12 col-md-3">{{ $t('if.algs.label') }}</dt>
      <dd class="col-sm-12 col-md-9">
        <span class="badge mr-1" :class="getBadgeClass(alg)" v-for="alg in sortedAlgs" :key="alg">
          {{ $t('if.algs.' + alg + '.label')}}
        </span>
      </dd>
      <dt class="col-sm-12 col-md-3">{{ $t('if.cycles.label') }}</dt>
      <dd class="col-sm-12 col-md-9">
        <dl class="row mb-0">
          <dt class="col-sm-4" v-if="cornerCycles">{{ $t('if.cycles.corners') }}</dt>
          <dd class="col-sm-8 mb-0" v-if="cornerCycles">{{ cornerCycles }}</dd>
          <dt class="col-sm-4" v-if="edgeCycles">{{ $t('if.cycles.edges') }}</dt>
          <dd class="col-sm-8 mb-0" v-if="edgeCycles">{{ edgeCycles }}</dd>
          <dt class="col-sm-4" v-if="centerCycles">{{ $t('if.cycles.centers') }}</dt>
          <dd class="col-sm-8 mb-0" v-if="centerCycles">{{ centerCycles }}</dd>
          <dt class="col-sm-4" v-if="parity">{{ $t('if.cycles.parity') }}</dt>
          <dd class="col-sm-8 mb-0" v-if="parity">{{ $t('common.yes') }}</dd>
        </dl>
      </dd>
      <dt class="col-sm-12 col-md-3">{{ $t('common.status') }}</dt>
      <dd class="col-sm-12 col-md-9 d-flex align-items-center justify-content-start">
        <b-spinner v-if="status == 0" variant="secondary" :label="$t('if.status.' + status)" class="mr-3"></b-spinner>
        <b-spinner v-if="status == 1" variant="warning" :label="$t('if.status.' + status)" class="mr-3"></b-spinner>
        {{ $t('if.status.' + status) }}
      </dd>
      <dt class="col-sm-12 col-md-3" v-if="result">{{ $t('if.fewestmoves') }}</dt>
      <dd class="col-sm-12 col-md-9" v-if="result">{{ result.fewest_moves || '-' }}</dd>
      <dt class="col-sm-12 col-md-3" v-if="result && result.fewest_moves || status == 2">{{ $t('if.solutions.label') }}</dt>
      <dd class="col-sm-12 col-md-9" v-if="status == 2 && !result">
        {{ $t('if.solutions.exceed') }}
      </dd>
      <dd class="col-sm-12 col-md-9" v-if="result && !result.solutions.length">
        {{ $t('if.solutions.no_proper') }}
      </dd>
      <dd class="col-sm-12 col-md-9" v-if="result && result.solutions.length">
        <b-card
          class="solution mb-3"
          v-for="({ insertions, final_solution, cancellation }, index) in result.solutions"
          :key="index"
        >
          <dl class="row mb-0">
            <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.solutions.insertions') }}</dt>
            <dd class="col-sm-12 col-md-8 col-lg-9">{{ insertions.length }}</dd>
            <template v-for="({ skeleton, insertion, insert_place }, i) in insertions">
              <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.skeleton.label') }}</dt>
              <dd class="col-sm-12 col-md-8 col-lg-9 mb-0">
                <pre v-html="formatSkeleton(skeleton, insertion, insert_place, i)"></pre>
              </dd>
              <dt class="col-sm-12 col-md-4 col-lg-3">@{{ i + 1 }}</dt>
              <dd class="col-sm-12 col-md-8 col-lg-9">
                <pre class="insertion" v-html="formatInsertion(skeleton, insertion, insert_place, i)">{{ insertion }}</pre>
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
      </dd>
    </dl>
  </div>
</template>

<script>
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import { formatAlgorithm } from '~/libs'

const MARKS = {
  NONE: 0,
  MERGED: 1,
  CANCELLED: 2,
}

export default {
  head() {
    return {
      title: [this.$t('if.title'), this.$t('title')].join(' - ')
    }
  },
  mounted() {
    if (this.status != 2) {
      this.timer = setInterval(this.updateResult.bind(this), 1000)
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  data() {
    return {
      timer: null
    }
  },
  async asyncData({ $axios, params, error }) {
    try {
      const data = await $axios.$get(`/if/${params.hash}`)
      return data
    } catch (e) {
      console.log(e)
      error({
        statusCode: e.response && e.response.status || 500
      })
    }
  },
  computed: {
    sortedAlgs() {
      const keys = Object.keys(this.$t('if.algs'))
      return this.algs.sort((a, b) => keys.indexOf(a) - keys.indexOf(b))
    }
  },
  methods: {
    async updateResult() {
      try {
        const result = await this.$axios.$get(`/if/${this.$route.params.hash}`, {
          progress: false
        })
        if (result.status !== this.status) {
          this.status = result.status
          this.result = result.result
        }
        if (result.status == 2) {
          clearInterval(this.timer)
        }
      } catch (e) {
        console.log(e)
      }
    },
    getBadgeClass(alg) {
      switch (alg) {
        case '3CP':
        case '2x2CP':
        case 'CO':
        case 'C-other':
          return 'badge-warning'
        case '3EP':
        case '2x2EP':
        case 'EO':
        case 'E-other':
          return 'badge-primary'
        case 'parity':
          return 'badge-danger'
        case 'center':
          return 'badge-info'
        case 'no-parity-other':
          return 'badge-secondary'
      }
    },
    formatSkeleton(skeleton, insertion, place, index) {
      skeleton = skeleton.split(' ')
      let first = skeleton.slice(0, place)
      let last = skeleton.slice(place, skeleton.length)
      let firstMarks = this.calcMarks(first, [...first, insertion])
      let lastMarks = this.calcMarks(last, this.rotateBefore(insertion, [insertion, ...last]), true)
      return [
        ...this.applyMarks(first, firstMarks),
        `[@${index + 1}]`,
        ...this.applyMarks(last, lastMarks),
      ].join(' ')
    },
    formatInsertion(skeleton, insertion, place, index) {
      skeleton = skeleton.split(' ')
      let first = skeleton.slice(0, place)
      let last = skeleton.slice(place, skeleton.length)
      insertion = insertion.split(' ')
      const beginMarks = this.calcMarks([...insertion], [...first, ...insertion], true)
      const endMarks = this.calcMarks([...insertion], [...insertion, ...last])
      const begin = this.applyMarks(insertion, beginMarks)
      const end = this.applyMarks(insertion, endMarks)
      for (let i = 0; i < insertion.length; i++) {
        if (insertion[i] != begin[i]) {
          insertion[i] = begin[i]
        } else if (insertion[i] != end[i]) {
          insertion[i] = end[i]
        }
      }
      return insertion.join(' ')
    },
    rotateBefore(insertion, moves) {
      const rotation = []
      insertion = insertion.split(' ')
      for (let i = 0; i < insertion.length; i++) {
        if ('xyz'.indexOf(insertion[i].charAt(0)) > -1) {
          rotation.push(this.inverse(insertion[i]))
        }
      }
      return [...rotation.reverse(), ...moves]
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
      algs = [...algs]
      for (let i = 0; i < algs.length; i++) {
        switch (marks[i]) {
          case MARKS.MERGED:
            algs[i] = `<span class="merged-move">${algs[i]}</span>`
            break
          case MARKS.CANCELLED:
            algs[i] = `<span class="cancelled-move">${algs[i]}</span>`
            break
        }
      }
      return algs
    },
    calcMarks(algs, final, atTheEnd = false) {
      // format final moves
      final = final.join(' ')
      final = formatAlgorithm(final)
      final = final.split(' ')
      // check rotations
      const rotations = []
      for (let i = 0; i < algs.length; i++) {
        if ('xyz'.indexOf(algs[i].charAt(0)) > -1) {
          rotations.push(algs[i])
        }
      }
      if (rotations.length > 0) {
        // slice notations
        algs = algs.slice(0, algs.length - rotations.length)
      }
      if (atTheEnd) {
        final.reverse()
        algs.reverse()
      }
      let cancellationIndex = algs.length
      const marks = []
      for (let i = 0; i < algs.length; i++) {
        if (algs[i] != final[i]) {
          // merged or cancelled
          if (final[i] && algs[i].charAt(0) === final[i].charAt(0)) {
            marks.push(MARKS.MERGED)
          } else {
            marks.push(MARKS.CANCELLED)
          }
          cancellationIndex = i
        } else if (i > cancellationIndex) {
          marks.push(MARKS.CANCELLED)
        } else {
          marks.push(false)
        }
      }
      if (atTheEnd) {
        algs.reverse()
        marks.reverse()
      }
      if (rotations.length > 0) {
        // append notations
        rotations.forEach(r => algs.push(r))
      }
      return marks
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
      top: 50%;
      width: 15px;
      height: 2px;
      background-color: red;
      transform: translateY(-1px);
    }
  }
}
pre {
  margin-bottom: 0;
  white-space: pre-wrap;
  &.insertion {
    background-color: #dedede;
    display: inline-block;
  }
}
</style>
