<template>
  <div>
    <h3>{{ $t('admin.user.if', { name: user.name }) }}</h3>
    <b-table
      striped
      hover
      :items="ifs"
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
      :base-url="`/admin/user/${user.id}/if/`"
      use-router
    ></b-pagination-nav>
  </div>
</template>

<script>
import { perPage } from '~/config/if'

export default {
  head() {
    return {
      title: [this.user.name, this.$t('admin.if.title'), this.$t('title')].join(' - ')
    }
  },
  data() {
    return {
      perPage: perPage,
      toBeUpdated: null,
      toBeRemoved: null,
      toBeRemovedIndex: 0,
      name: '',
    }
  },
  async asyncData({ app, $axios, redirect, error, params}) {
    const id = parseInt(params.id)
    if (Number.isNaN(id) || id <= 0) {
      return error({
        statusCode: 404
      })
    }
    const page = params.page || 1
    try {
      const user = await $axios.$get(`/admin/user/${id}`)
      const result = await $axios.$get(`/admin/user/${id}/if`, {
        params: {
          page,
        }
      })
      result.user = user
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
  }
}
</script>
