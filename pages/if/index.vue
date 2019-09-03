<template>
  <div>
    <h3>{{ $t('if.title') }}</h3>
    <div v-html="$t('if.description')"></div>
    <b-form @submit="submit" @reset="reset" class="my-3">
      <b-form-group
        :label="$t('if.name.label')"
        :description="$t('if.name.description')"
        label-size="lg"
        v-if="$auth.loggedIn"
      >
        <b-form-input
          v-model="form.name"
          type="text"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :label="$t('if.scramble.label')"
        label-size="lg"
      >
        <CubeInput
          v-model="form.scramble"
          type="text"
          required
          :state="scrambleValid"
          showRUF
        ></CubeInput>
        <CubeExpandedView :moves="form.scramble" v-if="scrambleValid" />
        <b-form-text v-html="$t('if.scramble.description')" v-if="scrambleValid !== false"></b-form-text>
        <b-form-invalid-feedback :state="scrambleValid">
          {{ $t('if.scramble.invalid') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('if.skeleton.label')"
        label-size="lg"
      >
        <CubeInput
          v-model="form.skeleton"
          required
          rows="6"
          :state="skeletonValid && cycleValid"
          type="textarea"
        ></CubeInput>
        <CubeExpandedView :moves="`${form.scramble}\n${form.skeleton}`" v-if="skeletonValid" best />
        <b-form-invalid-feedback :state="skeletonValid">
          {{ $t('if.skeleton.invalid') }}
        </b-form-invalid-feedback>
        <b-form-invalid-feedback :state="cycleValid">
          {{ $t('if.solutions.exceed') }}
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="skeletonValid && scrambleValid && cycleValid">
          {{ $t('if.cycles.label') }}:
          <span v-for="key in cycleKeys" :key="key" v-if="cycles[key]">
            <b>{{ $t('if.cycles.' + key) }}</b>: {{ cycles[key] }}
          </span>
        </b-form-valid-feedback>
        <b-form-text>
          <p class="mb-1">{{ $t('if.skeleton.description') }}</p>
          <ol class="pl-3">
            <li v-for="desc in $t('if.skeleton.list')" v-html="desc"></li>
          </ol>
        </b-form-text>
      </b-form-group>

      <b-form-group
        :label="$t('if.algs.label')"
        label-size="lg"
        :state="algsValid"
      >
        <b-button-group>
          <b-button variant="success" @click="checkAll">{{ $t('if.algs.all') }}</b-button>
          <b-button variant="secondary" @click="checkNone">{{ $t('if.algs.none') }}</b-button>
          <b-button variant="info" @click=checkNecessary>{{ $t('if.algs.necessary') }}</b-button>
        </b-button-group>
        <b-form-group
          v-for="{ type, list } in algTypes"
          :key="type"
          :label="$t('if.algs.' + type + '.label')"
        >
          <b-form-checkbox-group v-model="form.algs">
            <b-form-checkbox
              v-for="alg in list"
              :key="alg"
              :value="alg"
              class="alg"
              :class="{ 'suggest-alg': suggestAlgs.indexOf(alg) > -1 }"
            >
              {{ $t(['if.algs', alg, 'label'].join('.')) }}
              <a :href="`https://github.com/xuanyan0x7c7/insertionfinder/blob/master/data/algorithms/${alg}.txt`" target="_blank" class="text-info">
                <i class="material-icons">help_outline</i>
              </a>
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-form-invalid-feedback :state="algsValid">
          {{ $t('if.algs.description') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('if.greedy.label')"
        label-size="lg"
        :disabled="!$auth.loggedIn"
      >
        <b-form-input v-model="form.greedy" type="range" min="0" :max="maxGreedy"></b-form-input>
        <span>
          {{ form.greedy }}
          <NuxtLink v-if="!$auth.loggedIn" to="/login">
            {{ $t('common.loginRequired') }}
          </NuxtLink>
        </span>
        <b-form-text>{{ $t('if.greedy.description') }}</b-form-text>
      </b-form-group>


      <b-button type="submit" variant="primary" :disabled="!(scrambleValid && skeletonValid && algsValid && cycleValid)">{{ $t('form.submit') }}</b-button>
      <b-button type="reset" variant="secondary">{{ $t('form.reset') }}</b-button>
    </b-form>
  </div>
</template>

<script>
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import store from 'store'
import CubeInput from '~/components/CubeInput'
import CubeExpandedView from '~/components/CubeExpandedView'
import { formatAlgorithm, formatAlgorithmToArray, removeComment } from '~/libs'
import { maxCycles, maxSkeletonLength, maxScrambleLength, maxGreedy, cycleKeys } from '~/config/if'

export default {
  head() {
    return {
      title: [this.$t('if.title'), this.$t('title')].join(' - '),
      meta: [
        {
          name: 'description',
          hid: 'description',
          content: this.$t('description.if')
        }
      ]
    }
  },
  mounted() {
    const form = store.get('if.form')
    if (form) {
      Object.assign(this.form, form)
      if (!this.$auth.loggedIn) {
        this.form.greedy = 2
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        scramble: '',
        skeleton: '',
        algs: [],
        greedy: 2,
      },
      algTypes: [
        {
          type: 'corner',
          list: [
            '3CP',
            '3CP-pure',
            '2x2CP',
            'CO',
            'C-other',
          ],
        },
        {
          type: 'edge',
          list: [
            '3EP',
            '2x2EP',
            'EO',
            'E-other',
          ],
        },
        {
          type: 'other',
          list: [
            'parity',
            'center',
            'no-parity-other',
          ],
        },
        {
          type: 'extra',
          list: [
            'extras/parity',
            'extras/no-parity-other',
          ],
        },
      ],
      cycleKeys,
      maxGreedy,
    }
  },
  computed: {
    scrambleValid() {
      const scramble = this.form.scramble.trim()
      if (scramble.length == 0) {
        return null
      }
      try {
        const formatted = formatAlgorithmToArray(scramble)
        return formatted.length > 0 && formatted.length <= maxScrambleLength
      } catch (e) {
        return false
      }
    },
    skeletonValid() {
      const skeleton = this.form.skeleton.trim()
      if (skeleton.length == 0) {
        return null
      }
      try {
        const formatted = formatAlgorithmToArray(skeleton)
        return formatted.length <= 50
      } catch (e) {
        return false
      }
    },
    algsValid() {
      return this.form.algs.length > 0
    },
    cycles() {
      if (!this.scrambleValid || !this.skeletonValid) {
        return {}
      }
      try {
        const cube = new Cube()
        cube.twist(new Algorithm(formatAlgorithm(this.form.scramble)))
        cube.twist(new Algorithm(removeComment(this.form.skeleton)))
        const bestCube = cube.getBestPlacement()
        const corners = bestCube.getCornerCycles()
        const edges = bestCube.getEdgeCycles()
        const centers = centerCycleTable[bestCube.placement]
        const parity = bestCube.hasParity()
        return {
          corners,
          edges,
          centers,
          parity,
          total: (centers > 1 ? 0 : parity * 3) + (corners + edges + centers) * 2
        }
      } catch (e) {
        return {}
      }
    },
    cycleValid() {
      if (this.cycles.total === 0) {
        return null
      }
      return this.cycles.total && this.cycles.total <= maxCycles
    },
    suggestAlgs() {
      const cycles = this.cycles
      const suggestAlgs = []
      if (cycles.corners > 0) {
        suggestAlgs.push('3CP')
        suggestAlgs.push('3CP-pure')
      }
      if (cycles.edges > 0) {
        suggestAlgs.push('3EP')
      }
      if (cycles.centers > 0) {
        suggestAlgs.push('center')
      }
      if (cycles.parity) {
        suggestAlgs.push('parity')
      }
      return suggestAlgs
    }
  },
  methods: {
    async submit(e) {
      e.preventDefault()
      const form = this.form
      try {
        const result = await this.$axios.$post('/if', form)
        this.$router.push(`/if/${result.hash}`)
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          alert(e.response.data.message)
        } else {
          alert(e.message)
        }
      }
    },
    reset() {
      this.form = {
        name: '',
        scramble: '',
        skeleton: '',
        algs: [],
        greedy: 2,
      }
    },
    checkAll() {
      this.form.algs = this.algTypes.reduce((algs, type) => [...algs, ...type.list], [])
    },
    checkNone() {
      this.form.algs = []
    },
    checkNecessary() {
      this.form.algs = this.suggestAlgs
    }
  },
  watch: {
    form: {
      deep: true,
      handler(form) {
        store.set('if.form', form)
      }
    }
  },
  components: {
    CubeInput,
    CubeExpandedView,
  }
}
</script>

<style lang="less" scoped>
.alg {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    right: 0;
    border-bottom: 2px solid rgba(255, 0, 0, 0.5);
    transition: transform 0.3s ease-in-out;
    transform: scaleX(0);
    transform-origin: left center;
  }
}
.suggest-alg {
  &:after {
    transform: scaleX(1);
  }
}
.material-icons {
  font-size: 16px;
  vertical-align: middle;
}
</style>
