<template>
  <b-container>
    <b-modal id="modalInputWeight"> this is modal </b-modal>
    <b-button v-b-modal="'modalInputWeight'">Show Modal</b-button>
    <b-modal id="modalTest1">this is second modal</b-modal>
  </b-container>
</template>

<script>
export default {
  name: 'TestStoryBook',
}
</script>

<style scoped></style>
