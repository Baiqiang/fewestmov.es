<template>
  <div class="w-100 vh-100 d-flex flex-column justify-content-center align-items-center">
    <b-spinner
      class="loading-spinner"
      variant="secondary"
      type="grow"
    ></b-spinner>
    <p class="mt-3 h4">{{ $t('loading') }}</p>
  </div>
</template>

<style lang="less">
@loadingSize: 10em;
.loading-spinner {
  width: @loadingSize;
  height: @loadingSize;
}
</style>
