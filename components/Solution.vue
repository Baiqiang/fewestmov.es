<template>
  <div
    class="solution py-3"
  >
    <dl class="row mb-0">
      <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.solutions.insertions') }}</dt>
      <dd class="col-sm-12 col-md-8 col-lg-9">{{ solution.insertions.length }}</dd>
      <template v-for="{ formattedSkeleton, formattedInsertion, insertions } in _insertions">
        <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.skeleton.label') }}</dt>
        <dd class="col-sm-12 col-md-8 col-lg-9 mb-0">
          <pre v-html="formattedSkeleton"></pre>
        </dd>
        <template v-for="{ insertionSymbol, formattedInsertion } in insertions">
          <dt class="col-sm-12 col-md-4 col-lg-3">{{ insertionSymbol }}</dt>
          <dd class="col-sm-12 col-md-8 col-lg-9 mb-0">
            <pre class="insertion" v-html="formattedInsertion"></pre>
          </dd>
        </template>
      </template>
      <dt class="col-sm-12 col-md-4 col-lg-3 mt-3">{{ $t('if.solutions.final') }}</dt>
      <dd class="col-sm-12 col-md-8 col-lg-9 mt-3">
        <pre>{{ final_solution }}</pre>
      </dd>
      <dt class="col-sm-12 col-md-4 col-lg-3">{{ $t('if.solutions.cancellation') }}</dt>
      <dd class="col-sm-12 col-md-8 col-lg-9 mb-0">{{ cancellation }}</dd>
    </dl>
  </div>
</template>

<script>

export default {
  props: {
    solution: Object,
    merged: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    _insertions() {
      return this.merged ? this.solution.merged_insertions : this.solution.insertions
    },
    cancellation() {
      return this.solution.cancellation
    },
    final_solution() {
      return this.solution.final_solution
    },
  }
}
</script>

<style lang="less">
.solution {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  &:last-child {
    border-bottom: none;
  }
  dt {
    @media (min-width: 768px) {
      text-align: right;
    }
  }
  .merged-move {
    background-color: #11ddf7;
  }
  .cancelled-move {
    position: relative;
    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      left: -3px;
      right: -3px;
      top: 50%;
      height: 2px;
      background-color: rgba(255, 0, 0, 0.5);
      transform: translateY(-1px);
    }
  }
}
</style>
