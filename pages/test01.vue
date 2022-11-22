<template>
  <b-container>
    <fct-box :items="myFct" />
  </b-container>
</template>

<script>
import fctBox from '../components/molecules/fctBox'

export default {
  name: 'MyTest01',
  components: {
    fctBox,
  },
  data() {
    return {
      myFct: [],
    }
  },
  computed: {},
  created() {
    this.myFct = JSON.parse(JSON.stringify(this.$store.state.fire.fct))
  },
  methods: {},
}
</script>
