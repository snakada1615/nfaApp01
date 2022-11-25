<template>
  <b-container>
    <div>{{ $t('hello') }}</div>
  </b-container>
</template>

<script>
export default {
  name: 'IndexPage',
  created() {
    console.log(this.$store.state.fire.families)
  },
}
</script>
