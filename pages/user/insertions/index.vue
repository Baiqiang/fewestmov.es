<template>
  <div>
    <h3>{{ $t('user.insertions') }}</h3>
    <b-table
      striped
      hover
      :items="insertions"
      :fields="fields"
      :responsive="true"
      class="text-nowrap"
    >
      <template slot="link" slot-scope="data">
        <nuxt-link :to="'/if/' + data.item.hash">
          <b-button variant="warning" size="sm">
            <i class="material-icons">
              link
            </i>
          </b-button>
        </nuxt-link>
      </template>
      <template slot="name" slot-scope="data">
        <b-button variant="info" size="sm" @click="currentIF = data.item">
          <i class="material-icons">edit</i>
        </b-button>
        <span class="text-monospace">{{ data.item.name || data.item.hash }}</span>
      </template>
      <template slot="status" slot-scope="data">
        {{ $t('if.status.' + data.value) }}
      </template>
      <template slot="createdAt" slot-scope="data">
        {{ data.value|formatTime }}
      </template>
    </b-table>
    <b-pagination-nav
      v-if="totalPage"
      v-model="currentPage"
      :number-of-pages="totalPage"
      base-url="/user/insertions/"
      use-router
    ></b-pagination-nav>
    <b-modal
      v-model="showModal"
      :title="$t('user.if.changeName')"
      @show="name = currentIF.name"
      @ok="submit"
    >
      <template slot="modal-footer" slot-scope="{ ok, cancel, hide }">
        <b-button size="sm" variant="success" @click="ok()">
          {{ $t('form.save') }}
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          {{ $t('form.cancel') }}
        </b-button>
      </template>
      <b-form-input v-model="name" autofocus></b-form-input>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      perPage: 3,
      currentIF: null,
      name: '',
    }
  },
  async asyncData({ app, $axios, redirect, error, params}) {
    const page = params.page || 1
    try {
      const result = await $axios.$get('/user/insertions', {
        params: {
          page,
        }
      })
      result.currentPage = page
      return result
    } catch (e) {
      console.log(e)
      if (e.response) {
        if (e.response.status === 401) {
          app.$auth.setUser(null)
          return redirect('/login')
        }
      }
      error({
        statusCode: 500
      })
    }
  },
  computed: {
    showModal: {
      get() {
        return !!this.currentIF
      },
      set() {
        this.currentIF = null
      }
    },
    totalPage() {
      return Math.ceil(this.total / this.perPage)
    },
    fields() {
      return [
        {
          key: 'link',
          label: '',
        },
        {
          key: 'name',
          label: this.$t('if.name.label'),
        },
        {
          key: 'scramble',
          label: this.$t('if.scramble.label'),
        },
        {
          key: 'status',
          label: this.$t('common.status'),
        },
        {
          key: 'createdAt',
          label: this.$t('common.created_at'),
        },
      ]
    }
  },
  methods: {
    async submit() {
      const currentIF = this.currentIF
      try {
        const result = await this.$axios.$post(`/user/insertion/${currentIF.hash}`, {
          name: this.name
        })
        currentIF.name = result.name
      } catch (e) {
        // do nothing
      }
    }
  }
}
</script>
