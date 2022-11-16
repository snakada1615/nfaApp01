<template>
  <b-container>
    <div>hi</div>
  </b-container>
</template>

<script>
export default {
  name: 'IndexPage',
  created() {
    console.log(this.$store.state.fire.families)
  }
}
</script>
