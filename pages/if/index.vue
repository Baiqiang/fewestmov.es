<template>
  <div>
    <h3>{{ $t('if.title') }}</h3>
    <div v-html="$t('if.description')"></div>
    <b-form @submit="submit" @reset="reset" class="mt-3">
      <b-form-group
        :label="$t('if.scramble.label')"
        :description="$t('if.scramble.description')"
        label-size="lg"
      >
        <b-form-input
          v-model="form.scramble"
          type="text"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :label="$t('if.skeleton.label')"
        :description="$t('if.skeleton.description')"
        label-size="lg"
      >
        <b-form-textarea
          v-model="form.skeleton"
          required
          rows="6"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group
        :label="$t('if.algs.label')"
        label-size="lg"
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
      </b-form-group>

      <b-button type="submit" variant="primary">{{ $t('form.submit') }}</b-button>
      <b-button type="reset" variant="secondary">{{ $t('form.reset') }}</b-button>
    </b-form>
  </div>
</template>

<script>
import store from 'store'

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
      ]
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
