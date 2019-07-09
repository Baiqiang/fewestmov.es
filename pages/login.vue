<template>
  <Loading />
</template>

<script>
import Loading from '~/components/Loading'

export default {
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
