<template>
  <div>
    <h3>{{ $t('admin.if.title') }}</h3>
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
      <template slot="userIFs" slot-scope="data">
        <div v-if="data.value.length > 0">
          <div v-for="({name, user}, index) in data.value" class="d-flex">
            <a :href="'https://cubingchina.com/results/person/' + user.wcaId" target="_blank">{{ user.name }}</a>
            <div class="ml-1">
              {{ name }}
            </div>
          </div>
        </div>
        <span v-else>-</span>
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
      base-url="/admin/if/"
      use-router
    ></b-pagination-nav>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: [this.$t('admin.if.title'), this.$t('admin.title'), this.$t('title')].join(' - ')
    }
  },
  data() {
    return {
      perPage: 50,
      name: '',
    }
  },
  async asyncData({ app, $axios, redirect, error, params}) {
    const page = params.page || 1
    try {
      const result = await $axios.$get('/admin/if', {
        params: {
          page,
        }
      })
      result.currentPage = page
      return result
    } catch (e) {
      console.log(e)
      if (e.response) {
        switch (e.response.status) {
          case 401:
            app.$auth.setUser(null)
            return redirect('/login')
          default:
            return error({
              statusCode: e.response.status
            })
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
          key: 'userIFs',
          label: this.$t('admin.user.title'),
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
