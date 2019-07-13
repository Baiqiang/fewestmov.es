<template>
  <Loading />
</template>

<script>
import Loading from '~/components/Loading'

export default {
  head() {
    return {
      title: [this.$t('header.login'), this.$t('title')].join(' - ')
    }
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    } else {
      this.$auth.login()
    }
  },
  components: {
    Loading
  }
}
</script>
