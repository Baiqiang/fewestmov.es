<template>
  <div>
    <Header />
    <nuxt class="wrapper container" />
  </div>
</template>

<script>
import Header from '~/components/Header'

export default {
  components: {
    Header
  }
}
</script>

<style lang="less">
.wrapper {
  padding-top: 15px;
}
</style>
