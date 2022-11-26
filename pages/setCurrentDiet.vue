<template>
  <b-container>
    <b-form-datepicker
      id="datepicker01"
      v-model="surveyDate"
      size="sm"
      class="mb-2"
      :state="surveyDate !== ''"
      aria-describedby="datepicker01-feedback"
    />
    <!-- This will only be shown if the preceding input has an invalid state -->
    <b-form-invalid-feedback id="datepicker01-feedback">
      set survey date first
    </b-form-invalid-feedback>

    <div v-if="surveyDate">
      <fct-box :items="$store.state.fire.fct" @fctClickPlus="openWeightModal" />
      <fct-set-weight-modal
        :v-if="targetCrop"
        :selected-item="targetCrop"
        :portion-units="$store.state.fire.portionUnit"
        :show-modal.sync="showModal"
        :menu-name.sync="menuName"
        :weight.sync="menuWeight"
        @modalOk="addRecipe"
      />
      <recipe-table
        :items="recipeTableItems"
        @itemDeleted="updateRecipes"
        @itemEdit="editRecipeItem"
      />
    </div>
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
      surveyDate: '',
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
      this.menuName = ''
      this.menuWeight = 0
      this.showModal = true
    },
    /**
     * recipeTableItems全体を入れ替え
     * @param val
     */
    updateRecipes(val) {
      this.recipeTableItems.splice(0, this.recipeTableItems.length, ...val)
    },
    /**
     * recipeTableをクリックしてアイテム(val)を編集
     * @param val
     */
    editRecipeItem(val) {
      console.log(val)
      this.targetCrop = Object.assign(
        {},
        {
          id: val.id,
          Group: val.Group,
          Name: val.Name,
          En: val.En,
          Pr: val.Pr,
          Va: val.Va,
          Fe: val.Fe,
        }
      )
      this.menuName = val.foodName
      this.menuWeight = val.Wt
      this.showModal = true
    },
    /**
     * recipeTableItemsに1項目を追加または修正
     * @param val
     */
    addRecipe(val) {
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
