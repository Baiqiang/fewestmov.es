<template>
  <div>
    <dl class="row">
      <dt class="col-xs-12 col-sm-3">{{ $t('if.scramble.label') }}</dt>
      <dd class="col-xs-12 col-sm-9">
        <pre>{{ scramble }}</pre>
      </dd>
      <dt class="col-xs-12 col-sm-3">{{ $t('if.skeleton.label') }}</dt>
      <dd class="col-xs-12 col-sm-9">
        <pre v-html="commentSkeleton(skeleton)"></pre>
        <hr>
        {{ $t('if.skeleton.to', { length: formatAlgorithmToArray(skeleton).length, detail: formatCycleDetail(cycleDetail) }) }}
      </dd>
      <dt class="col-xs-12 col-sm-3">{{ $t('if.algs.label') }}</dt>
      <dd class="col-xs-12 col-sm-9">
        <span class="badge mr-1" :class="getBadgeClass(alg)" v-for="alg in sortedAlgs" :key="alg">
          {{ $t('if.algs.' + alg + '.label')}}
        </span>
      </dd>
      <dt class="col-xs-12 col-sm-3">{{ $t('if.cycles.label') }}</dt>
      <dd class="col-xs-12 col-sm-9">
        <dl class="row mb-0">
          <template v-for="key in cycleKeys" v-if="cycles[key]">
            <dt class="col-sm-4">{{ $t(`if.cycles.${key}`) }}</dt>
            <dd class="col-sm-8 mb-0">{{ key === 'parity' ? $t('common.yes') : cycles[key] }}</dd>
          </template>
        </dl>
      </dd>
      <dt class="col-xs-12 col-sm-3">{{ $t('if.greedy.label') }}</dt>
      <dd class="col-xs-12 col-sm-9">{{ greedy }}</dd>
      <dt class="col-xs-12 col-sm-3">{{ $t('common.status') }}</dt>
      <dd class="col-xs-12 col-sm-9 d-flex align-items-center justify-content-start">
        <b-spinner v-if="status == 0" variant="secondary" :label="$t('if.status.' + status)" class="mr-3"></b-spinner>
        <b-spinner v-if="status == 1" variant="warning" :label="$t('if.status.' + status)" class="mr-3"></b-spinner>
        {{ $t('if.status.' + status) }}
      </dd>
      <dt class="col-xs-12 col-sm-3" v-if="result">{{ $t('if.duration') }}</dt>
      <dd class="col-xs-12 col-sm-9" v-if="result">{{ result.duration | duration }}</dd>
      <dt class="col-xs-12 col-sm-3" v-if="result">{{ $t('if.fewestmoves') }}</dt>
      <dd class="col-xs-12 col-sm-9" v-if="result">{{ result.fewest_moves || '-' }}</dd>
      <dt class="col-xs-12 col-sm-3" v-if="result && result.fewest_moves || status == 2">{{ $t('if.solutions.label') }}</dt>
      <dd class="col-xs-12 col-sm-9" v-if="status == 2 && !result">
        {{ $t('if.solutions.exceed') }}
      </dd>
      <dd class="col-xs-12 col-sm-9" v-if="result && !result.solutions.length">
        {{ $t('if.solutions.no_proper') }}
      </dd>
      <dd class="col-xs-12 col-sm-9" v-if="result && result.solutions.length">
        <Solution :solution="solution" v-for="(solution, index) in result.solutions" :key="index" />
      </dd>
    </dl>
  </div>
</template>

<script>
import Solution from '~/components/Solution'
import { formatAlgorithmToArray } from '~/libs'
import { cycleKeys } from '~/config/if'

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
      timer: null,
      cycleKeys
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
    formatAlgorithmToArray,
    formatCycleDetail(cycleDetail) {
      const detail = []
      cycleDetail.corner.filter(cycle => cycle.length > 1).forEach(cycle => {
        detail.push(cycle.length + 'C')
      })
      const twist = cycleDetail.corner.filter(cycle => cycle.length == 1).reduce((t, cycle) => cycle.length + t, 0)
      if (twist) {
        detail.push(twist + 'T')
      }
      cycleDetail.edge.filter(cycle => cycle.length > 1).forEach(cycle => {
        detail.push(cycle.length + 'E')
      })
      const flip = cycleDetail.edge.filter(cycle => cycle.length == 1).reduce((f, cycle) => cycle.length + f, 0)
      if (flip) {
        detail.push(flip + 'F')
      }
      cycleDetail.center.forEach(cycle => {
        detail.push(cycle.length + 'X')
      })
      return detail.join('')
    },
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
        case '3CP-pure':
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
        case 'extras/parity':
          return 'badge-danger'
        case 'center':
          return 'badge-info'
        case 'no-parity-other':
        case 'extras/no-parity-other':
          return 'badge-secondary'

      }
    },
    commentSkeleton(skeleton) {
      return skeleton.split('\n').map(s => {
        s = s.split('//')
        if (s.length === 1) {
          return s[0]
        }
        return s[0] + '<span class="text-muted">//' + s.slice(1, s.length).join('//') + '</span>'
      }).join('\n')
    }
  },
  components: {
    Solution
  }
}
</script>

<style lang="less">
pre {
  margin-bottom: 0;
  white-space: pre-wrap;
  &.insertion {
    background-color: #dedede;
    display: inline-block;
  }
}
</style>
