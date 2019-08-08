<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>
    <h3>{{ $t('admin.user.if', { name: user.name }) }}</h3>
    <div class="row">
      <div
        class="col-sm-12 col-md-6 col-lg-4 col-xl-3 py-3"
        v-for="(userIF, index) in ifs"
      >
       <UserIFSummary :userIF="userIF"></UserIFSummary>
      </div>
    </div>
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
import UserIFSummary from '~/components/UserIFSummary'

export default {
  head() {
    return {
      title: [this.user.name, this.$t('admin.if.title'), this.$t('title')].join(' - ')
    }
  },
  data() {
    return {
      perPage
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
    breadcrumbs() {
      return [
        {
          text: this.$t('admin.title')
        },
        {
          text: this.$t('admin.user.title'),
          to: '/admin/user',
        },
        {
          text: this.user.name
        }
      ]
    }
  },
  components: {
    UserIFSummary
  }
}
</script>
