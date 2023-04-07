<template>
  <b-container>
    Push Meeeeeee!
    <b-button @click="onClick">push me</b-button>
  </b-container>
</template>

<script>
export default {
  name: 'TestStoryBook',
  methods: {
    onClick() {
      this.$emit('clickedEmit', true)
      alert('clicked')
    },
  },
}
</script>

<style scoped></style>
