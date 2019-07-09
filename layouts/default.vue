<template>
  <div>
    <Header />
    <nuxt class="wrapper" />
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
  padding-top: 60px;
}
</style>
