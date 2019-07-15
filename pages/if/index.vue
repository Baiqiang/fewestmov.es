<template>
  <div>
    <h3>{{ $t('if.title') }}</h3>
    <div v-html="$t('if.description')"></div>
    <b-form @submit="submit" @reset="reset" class="mt-3">
      <b-form-group
        :label="$t('if.scramble.label')"
        label-size="lg"
      >
        <b-form-input
          v-model="form.scramble"
          type="text"
          required
          :state="scrambleValid"
        ></b-form-input>
        <b-form-text v-html="$t('if.scramble.description')" v-if="scrambleValid !== false"></b-form-text>
        <b-form-invalid-feedback :state="scrambleValid">
          {{ $t('if.scramble.invalid') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('if.skeleton.label')"
        label-size="lg"
      >
        <b-form-textarea
          v-model="form.skeleton"
          required
          rows="6"
          :state="skeletonValid && cycleValid"
        ></b-form-textarea>
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
            >
              {{ $t(['if.algs', alg, 'label'].join('.')) }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-form-invalid-feedback :state="algsValid">
          {{ $t('if.algs.description') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="!(scrambleValid && skeletonValid && algsValid && cycleValid)">{{ $t('form.submit') }}</b-button>
      <b-button type="reset" variant="secondary">{{ $t('form.reset') }}</b-button>
    </b-form>
  </div>
</template>

<script>
import { Cube, Algorithm, centerCycleTable } from 'insertionfinder'
import store from 'store'
import { formatAlgorithm } from '~/libs'
import { maxCycles } from '~/config/if'

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
    }
  },
  data() {
    return {
      form: {
        scramble: '',
        skeleton: '',
        algs: []
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
      ],
      cycleKeys: [
        'corners',
        'edges',
        'centers',
        'parity',
      ]
    }
  },
  computed: {
    scrambleValid() {
      if (this.form.scramble.length == 0) {
        return null
      }
      try {
        const alg = new Algorithm(this.form.scramble)
        return alg.twists.length > 0
      } catch (e) {
        return false
      }
    },
    skeletonValid() {
      if (this.form.skeleton.length == 0) {
        return null
      }
      try {
        formatAlgorithm(this.form.skeleton)
        return formatAlgorithm.length > 0
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
      const cube = new Cube()
      cube.twist(new Algorithm(this.form.scramble))
      cube.twist(new Algorithm(formatAlgorithm(this.form.skeleton)))
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
    },
    cycleValid() {
      return this.cycles.total <= maxCycles
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
        scramble: '',
        skeleton: '',
        algs: []
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(form) {
        store.set('if.form', form)
      }
    }
  }
}
</script>
