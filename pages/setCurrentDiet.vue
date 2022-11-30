<template>
  <b-container>
    <div>current family: {{ $store.state.fire.current.familyName }}</div>

    <!--   Add/Editの選択   -->
    <b-form-radio-group
      v-model="modeDiet"
      :options="['Add', 'Edit', 'Delete']"
      button-variant="outline-primary"
      buttons
      size="sm"
      class="mb-2"
      @change="test"
    />

    <b-button
      v-if="modeDiet === 'Add'"
      size="sm"
      block
      class="mb-2"
      variant="primary"
      :state="stateNewDiet"
      :disabled="!stateNewDiet"
      >add new
    </b-button>

    <b-select v-if="modeDiet === 'Edit'" size="sm" block class="mb-2"
      >select
    </b-select>

    <b-button
      v-if="modeDiet === 'Delete'"
      size="sm"
      block
      class="mb-2"
      variant="primary"
      >delete selected record
    </b-button>

    <b-form-datepicker
      id="datepicker01"
      v-model="surveyDate"
      size="sm"
      class="mb-2"
      :state="surveyDate !== ''"
      aria-describedby="datepicker01-feedback"
      :date-info-fn="dateClass"
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
      modeDiet: 'Add',
    }
  },
  computed: {
    stateNewDiet: {
      get() {
        return this.surveyDate && this.recipeTableItems.length > 0
      },
    },
  },
  created() {
    this.myFct = JSON.parse(JSON.stringify(this.$store.state.fire.fct))
  },
  methods: {
    test() {
      console.log('test')
    },
    dateClass(ymd, date) {
      const myDateObject = this.$store.getters['fire/surveyDateList']
      let myDate
      if (Object.keys(myDateObject).length) {
        myDate = Object.values(myDateObject)[0]
      } else {
        myDate = ['2022-11-05']
      }

      // const myDate = '2022-11-05'
      const day =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2)
      if (myDate.includes(day)) {
        return 'table-info'
      } else {
        return ''
      }
    },
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
      val.date = this.surveyDate
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
      // reactiveを維持しながらrecipeTableを更新
      console.log(this.$store.state.fire.families)
      this.recipeTableItems.splice(0, this.recipeTableItems.length, ...res)

      // reactiveの値を用いてstare.familiesを更新
      this.$store.dispatch('fire/updateDiet', {
        name: this.$store.state.fire.current.familyName,
        diet: this.recipeTableItems,
      })
      console.log(this.$store.state.fire.families)

      // 更新フラグを立てる
      this.$store.dispatch('fire/setUpdateFlag', {
        element: 'families',
        value: true,
      })
    },
    storeUpdateRecipes() {
      this.$store.dispatch('fire/updateRecipes', {
        name: this.$store.state.fire.current.familyName,
        diet: this.recipeTableItems,
      })
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
