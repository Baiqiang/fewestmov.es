<template>
  <Loading />
</template>

<script>
import Loading from '~/components/Loading'

export default {
  async mounted() {
    if (this.$auth.loggedIn) {
      try {
        await this.$axios.post('/logout')
        this.$auth.setUser(null)
      } catch (e) {

      }
    }
    this.$router.push('/')
  },
  components: {
    Loading
  }
}
</script>
