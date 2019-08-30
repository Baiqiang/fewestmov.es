<template>
  <div>
    <b-form-textarea
      v-if="type === 'textarea'"
      v-model="computedValue"
      :required="required"
      :rows="rows"
      :state="state"
      @focus="onFocus"
      ref="input"
    ></b-form-textarea>
    <b-form-input
      v-else
      v-model="computedValue"
      :required="required"
      :state="state"
      :type="type"
      @focus="onFocus"
      ref="input"
    ></b-form-input>
    <Keyboard @input="onInput" @backspace="onBackspace" @close="onClose" @open="onOpen" :open="open" :showRUF="showRUF" v-if="showKeyboard" />
  </div>
</template>

<script>
import formMixin from 'bootstrap-vue/src/mixins/form'
import formStateMixin from 'bootstrap-vue/src/mixins/form-state'
import Keyboard from '~/components/Keyboard'

export default {
  mixins: [
    formMixin,
    formStateMixin,
  ],
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    rows: {
      type: [Number, String],
      default: 2
    },
    type: {
      type: String,
      default: 'text'
    },
    showRUF: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      computedValue: '',
      open: false,
      showKeyboard: false,
    }
  },
  mounted() {
    this.showKeyboard = 'ontouchstart' in window
  },
  watch: {
    computedValue(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.computedValue = val
    }
  },
  methods: {
    onFocus(e) {
      if (this.open) {
        e.target.blur()
      }
    },
    onClose() {
      this.open = false
    },
    onOpen() {
      this.$refs.input.blur()
      this.open = true
      this.scrollInput()
    },
    onInput(val) {
      if (this.value === '') {
        this.$emit('input', val)
      } else {
        this.$emit('input', `${this.value} ${val}`)
      }
      this.scrollInput()
    },
    onBackspace() {
      this.$emit('input', this.value.replace(/(.*?)\s*(([RLUDFB]w?|[xyz])['2]?|NISS|niss|\[[rludfb]['2]?\]|.)\s*$/s, '$1'))
      this.scrollInput()
    },
    scrollInput() {
      const input = this.$refs.input.$refs.input
      this.$nextTick(() => {
        input.scrollLeft = input.scrollWidth
        input.scrollTop = input.scrollHeight
      })
    }
  },
  components: {
    Keyboard
  }
}
</script>
