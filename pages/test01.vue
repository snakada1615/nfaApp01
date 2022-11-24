<template>
  <b-container>
    <b-button size="sm" @click="showModal = true">click</b-button>
    <b-form-input v-model="fctId" type="number" />
    menuName: {{ menuName }}, menuWeight: {{ menuWeight }}
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
      menuName: 'hage',
      menuWeight: 231,
      field01: [{}],
      fctId: 0,
    }
  },
  computed: {
    targetCrop: {
      get() {
        return this.myFct.find((item) => item.id === this.fctId) || {}
      },
    },
  },
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
