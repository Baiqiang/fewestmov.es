<template>
  <div>
    <h3>{{ $t('admin.if.title') }}</h3>
    <div class="row">
      <div
        class="col-sm-12 col-md-6 col-lg-4 col-xl-3 py-3"
        v-for="(userIF, index) in ifs"
      >
       <UserIFSummary :userIF="userIF" show-user></UserIFSummary>
      </div>
    </div>
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
import { perPage } from '~/config/if'
import UserIFSummary from '~/components/UserIFSummary'

export default {
  head() {
    return {
      title: [this.$t('admin.if.title'), this.$t('admin.title'), this.$t('title')].join(' - ')
    }
  },
  data() {
    return {
      perPage
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
  components: {
    UserIFSummary
  }
}
</script>
