<template>
  <span>
    <select :value="value" @input="selected">
      <option v-for="option in options" :key="option.code" :value="option.code">
        {{ option.name }}
      </option></select
    ><span class="slot-text"><slot></slot></span>
  </span>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selected($event) {
      this.$emit('selected', $event.target.value, this.id)
    },
  },
}
</script>
