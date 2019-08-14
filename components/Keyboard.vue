<template>
  <div class="w-100 row keyboard">
    <div class="key" v-if="!open" v-touch.prevent.stop="onOpen">
      <i class="material-icons">keyboard</i>
    </div>
    <template v-else-if="open">
      <div v-for="keys in btns" class="d-flex flex-column col px-0">
        <div class="key" :class="`key-${key.charAt(0).toLowerCase()}`" v-for="key in keys" v-touch.prevent.stop="onTap" :data-key="key">{{ key }}</div>
      </div>
      <div class="w-100"></div>
      <div class="col px-0" v-if="showRUF">
        <div class="key" v-touch.prevent.stop="onTap" data-key="R' U' F">R' U' F</div>
      </div>
      <div class="col px-0" v-else>
        <div class="key" v-touch.prevent.stop="onTap" data-key="NISS">NISS</div>
      </div>
      <div class="col px-0">
        <div class="key" v-touch.prevent.stop="onBackspace">
          <i class="material-icons">backspace</i>
        </div>
      </div>
      <div class="col px-0">
        <div class="key" v-touch.prevent.stop="onClose">
          <i class="material-icons">close</i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    showRUF: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btns: [
        [
          'R',
          "R'",
          'R2',
        ],
        [
          'L',
          "L'",
          'L2',
        ],
        [
          'U',
          "U'",
          'U2',
        ],
        [
          'D',
          "D'",
          'D2',
        ],
        [
          'F',
          "F'",
          'F2',
        ],
        [
          'B',
          "B'",
          'B2',
        ],
      ]
    }
  },
  methods: {
    onTap(event) {
      this.$emit('input', event.target.dataset.key)
    },
    onBackspace() {
      this.$emit('backspace')
    },
    onClose() {
      this.$emit('close')
    },
    onOpen() {
      this.$emit('open')
    }
  }
}
</script>
