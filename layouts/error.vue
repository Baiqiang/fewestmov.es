<template>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center">
    <h1 v-if="error.statusCode === 404">{{ $t('error.title.404') }}</h1>
    <h1 v-else-if="error.statusCode === 403">{{ $t('error.title.403') }}</h1>
    <h1 v-else>{{ $t('error.title.other') }}</h1>
  </div>
</template>

<script>
export default {
  props: ['error'],
}
</script>
