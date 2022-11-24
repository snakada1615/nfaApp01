<template>
  <b-container>
    <fct-box :items="$store.state.fire.fct" @fctClickPlus="openWeightModal" />
    <fct-set-weight-modal
      :v-if="targetCrop"
      :selected-item="targetCrop"
      :portion-units="$store.state.fire.portionUnit"
      :show-modal.sync="showModal"
      :menu-name.sync="menuName"
      :weight.sync="menuWeight"
    />
  </b-container>
</template>

<script>
import fctSetWeightModal from '@/components/molecules/fctSetWeightModal'
import fctBox from '@/components/molecules/fctBox'
import { makeToast } from '@/plugins/helper'

export default {
  name: 'MyTest01',
  components: {
    fctSetWeightModal,
    fctBox,
  },
  data() {
    return {
      myFct: [],
      showModal: false,
      menuName: '',
      menuWeight: 0,
      targetCrop: {},
    }
  },
  computed: {},
  created() {
    this.myFct = JSON.parse(JSON.stringify(this.$store.state.fire.fct))
  },
  methods: {
    modalOk(val) {
      console.log(val)
    },
    modalCancel() {
      console.log('cancel')
    },
    openWeightModal(val) {
      this.targetCrop = Object.assign({}, val)
      this.showModal = true
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
