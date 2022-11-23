<template>
  <b-container>
    <b-button @click="saveMe">push me</b-button>
    <fct-box :items="myFct" @fctClick="showClick" />
  </b-container>
</template>

<script>
import fctBox from '../components/molecules/fctBox'
import { makeToast } from '@/plugins/helper'

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
  methods: {
    showClick(val) {
      console.log(val)
    },
    async saveMe() {
      await this.$store.dispatch('fire/updateLoadingState', true)
      await this.$store.dispatch('fire/saveDri')
      await this.$store.dispatch('fire/updateLoadingState', false)
      makeToast(this, 'save dri complete')
    },
  },
}
</script>
