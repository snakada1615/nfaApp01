<template>
  <b-container>
    <b-button size="sm" @click="showModal = true">click</b-button>
    <fct-set-weight-modal
      :show-modal="showModal"
      :selected-item="myFct[0]"
      :portion-units="$store.state.fire.portionUnit"
      :menu-name="menuName"
      :weight="menuWeight"
      @modalOk="modalOk"
      @modalCancel="modalCancel"
    />
  </b-container>
</template>

<script>
import fctSetWeightModal from '@/components/molecules/fctSetWeightModal'
import { makeToast } from '@/plugins/helper'

export default {
  name: 'MyTest01',
  components: {
    fctSetWeightModal,
  },
  data() {
    return {
      myFct: [],
      showModal: false,
      menuName: '',
      menuWeight: 0,
      field01: [{}],
    }
  },
  computed: {},
  created() {
    this.myFct = JSON.parse(JSON.stringify(this.$store.state.fire.fct))
  },
  methods: {
    modalOk(val) {
      console.log(val)
      this.showModal = false
    },
    modalCancel() {
      console.log('cancel')
      this.showModal = false
    },
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
