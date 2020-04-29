<template>
  <div>
    <dl class="row">
      <template v-if="type === 0">
        <dt class="col-xs-12 col-sm-3">{{ $t('if.scramble.label') }}</dt>
        <dd class="col-xs-12 col-sm-9">
          <pre>{{ scramble }}</pre>
          <CubeExpandedView :moves="scramble" />
        </dd>
        <dt class="col-xs-12 col-sm-3">{{ $t('if.skeleton.label') }}</dt>
        <dd class="col-xs-12 col-sm-9">
          <pre v-html="commentSkeleton(skeleton)"></pre>
          <hr>
          {{ $t('if.skeleton.to', { length: formatAlgorithmToArray(skeleton).length, detail: formatCycleDetail(cycleDetail) }) }}
          <CubeExpandedView :moves="`${scramble}\n${skeleton}`" best />
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
      </template>
      <template v-else>
        <dt class="col-xs-12 col-sm-3">{{ $t('if.skeleton.label') }}</dt>
        <dd class="col-xs-12 col-sm-9">
          <pre>{{ skeleton }}</pre>
        </dd>
      </template>
      <dt class="col-xs-12 col-sm-3">{{ $t('common.status') }}</dt>
      <dd class="col-xs-12 col-sm-9 d-flex align-items-center justify-content-start">
        <b-spinner v-if="status == 0" variant="secondary" :label="$t('if.status.' + status)" class="mr-3"></b-spinner>
        <b-spinner v-if="status == 1" variant="warning" :label="$t('if.status.' + status)" class="mr-3"></b-spinner>
        {{ $t('if.status.' + status) }}
      </dd>
      <template v-if="status == 2">
        <dt class="col-xs-12 col-sm-3">{{ $t('if.duration') }}</dt>
        <dd class="col-xs-12 col-sm-9">{{ result.duration | duration }}</dd>
        <dt class="col-xs-12 col-sm-3">{{ $t('if.fewestmoves') }}</dt>
        <dd class="col-xs-12 col-sm-9">{{ result.fewest_moves || '-' }}</dd>
        <dt class="col-xs-12 col-sm-3">{{ $t('if.solutions.label') }}</dt>
        <dd class="col-xs-12 col-sm-9" v-if="!result">
          {{ $t('if.solutions.exceed') }}
        </dd>
        <dd class="col-xs-12 col-sm-9" v-else-if="!result.solutions.length">
          {{ $t('if.solutions.no_proper') }}
        </dd>
        <dd class="col-xs-12 col-sm-9" v-else>
          <template v-if="!result.solutions[0].merged_insertions.length">
            <Solution :solution="solution" v-for="(solution, index) in result.solutions" :key="index" :merged="false" />
          </template>
          <template v-else>
            <b-tabs content-class="mt-3">
              <b-tab :title="$t('if.solutions.merged')" active>
                <Solution :solution="solution" v-for="(solution, index) in result.solutions" :key="index" />
              </b-tab>
              <b-tab :title="$t('if.solutions.expanded')">
                <Solution :solution="solution" v-for="(solution, index) in result.solutions" :key="index" :merged="false" />
              </b-tab>
            </b-tabs>
          </template>
        </dd>
      </template>
    </dl>
  </div>
</template>

<script>
import Solution from '~/components/Solution'
import CubeExpandedView from '~/components/CubeExpandedView'
import { formatAlgorithmToArray, formatIFResult } from '~/libs'
import { cycleKeys } from '~/config/if'

const routes = [
  'if',
  'sf'
]

export default {
  head() {
    return {
      title: [this.$t(`${routes[this.type]}.title`), this.$t('title')].join(' - ')
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
  async asyncData({ $axios, params, error, redirect, route }) {
    try {
      const data = await $axios.$get(`/if/${params.hash}`)
      if (!route.path.includes(routes[data.type])) {
        return redirect(`/${routes[data.type]}/${params.hash}`)
      }
      formatIFResult(data)
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
        const data = await this.$axios.$get(`/if/${this.$route.params.hash}`, {
          progress: false
        })
        formatIFResult(data)
        if (data.status !== this.status) {
          this.status = data.status
          this.result = data.result
        }
        if (data.status == 2) {
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
        case '3CP3EP':
          return 'badge-success'
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
    Solution,
    CubeExpandedView,
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
