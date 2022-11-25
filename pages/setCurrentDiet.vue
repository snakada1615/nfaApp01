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
      @modalOk="setRecipe"
    />
    <recipe-table :items="recipeTableItems" />
  </b-container>
</template>

<script>
import fctSetWeightModal from '@/components/molecules/fctSetWeightModal'
import fctBox from '@/components/molecules/fctBox'
import recipeTable from '@/components/molecules/recipeTable'
import { makeToast } from '@/plugins/helper'

export default {
  name: 'MyTest01',
  components: {
    fctSetWeightModal,
    fctBox,
    recipeTable,
  },
  data() {
    return {
      myFct: [],
      showModal: false,
      menuName: '',
      menuWeight: 0,
      targetCrop: {},
      recipeTableItems: [],
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
    setRecipe(val) {
      let isNew = true
      const res = this.recipeTableItems.map((item) => {
        if (
          item.cropInfo.Name === val.cropInfo.Name &&
          item.cropInfo.id === val.cropInfo.id
        ) {
          isNew = false
          return val
        } else {
          return item
        }
      })
      //
      if (isNew) {
        res.push(val)
      }
      this.recipeTableItems.splice(0, this.recipeTableItems.length, ...res)
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
