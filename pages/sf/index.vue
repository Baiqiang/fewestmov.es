<template>
  <div>
    <h3>{{ $t('sf.title') }}<small>Beta</small></h3>
    <div v-html="$t('sf.description')"></div>
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
        :label="$t('if.skeleton.label')"
        label-size="lg"
      >
        <CubeInput
          v-model="form.skeleton"
          type="text"
          required
          :state="skeletonValid"
          showRUF
        ></CubeInput>
        <b-form-invalid-feedback :state="skeletonValid">
          {{ $t('if.skeleton.invalid') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="!skeletonValid">{{ $t('form.submit') }}</b-button>
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
import { maxSkeletonLength } from '~/config/if'

export default {
  head() {
    return {
      title: [this.$t('sf.title'), this.$t('title')].join(' - '),
      meta: [
        {
          name: 'description',
          hid: 'description',
          content: this.$t('description.sf')
        }
      ]
    }
  },
  mounted() {
    const form = store.get('sf.form')
    if (form) {
      Object.assign(this.form, form)
    }
  },
  data() {
    return {
      form: {
        type: 1,
        name: '',
        skeleton: '',
      },
    }
  },
  computed: {
    skeletonValid() {
      const skeleton = this.form.skeleton.trim()
      if (skeleton.length == 0) {
        return null
      }
      try {
        const formatted = formatAlgorithmToArray(skeleton)
        return formatted.length <= maxSkeletonLength
      } catch (e) {
        return false
      }
    }
  },
  methods: {
    async submit(e) {
      e.preventDefault()
      const form = this.form
      try {
        const result = await this.$axios.$post('/if', form)
        this.$router.push(`/sf/${result.hash}`)
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
        skeleton: '',
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(form) {
        store.set('sf.form', form)
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
.material-icons {
  font-size: 16px;
  vertical-align: middle;
}
</style>
