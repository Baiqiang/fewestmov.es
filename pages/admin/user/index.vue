<template>
  <div>
    <h3>{{ $t('admin.user.title') }}</h3>
    <b-table
      striped
      hover
      :items="users"
      :fields="fields"
      :responsive="true"
      class="text-nowrap"
    >
      <template slot="wcaId" slot-scope="data">
        <a :href="'https://cubingchina.com/results/person/' + data.value" target="_blank">{{ data.value }}</a>
      </template>
      <template slot="avatar" slot-scope="data">
        <b-img-lazy class="avatar" fluid :src="data.value" :alt="data.item.name"></b-img-lazy>
      </template>
      <template slot="createdAt" slot-scope="data">
        {{ data.value|formatTime }}
      </template>
    </b-table>
    <b-pagination-nav
      v-if="totalPage"
      v-model="currentPage"
      :number-of-pages="totalPage"
      base-url="/admin/user/"
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
      const result = await $axios.$get('/admin/user', {
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
          key: 'id',
          label: this.$t('common.id'),
        },
        {
          key: 'name',
          label: this.$t('user.name'),
        },
        {
          key: 'wcaId',
          label: this.$t('user.name'),
        },
        {
          key: 'avatar',
          label: this.$t('user.avatar'),
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

<style lang="less">
img.avatar {
  max-height: 100px;
}
</style>
