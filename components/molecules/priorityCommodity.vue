<template>
  <b-container>
    <b-card
      style="min-width: 530px"
      header-bg-variant="success"
      bg-variant="light"
      border-variant="success"
      class="mx-1 px-0 my-2"
    >
      <template #header>
        <div>Select key nutrient for your target family/HH</div>
      </template>
      <b-row>
        <b-col>
          <b-form-group class="ml-2">
            <b-form-radio-group
              v-model="selectedNutrientComputed"
              :options="nutrientOptions"
              button-variant="outline-primary"
              buttons
              stacked
              class="ml-4"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <div>Month</div>
          <b-form-select
            v-model="selectedMonthComputed"
            :options="monthOptions"
          />
        </b-col>
      </b-row>
    </b-card>
    <b-card
      style="min-width: 530px"
      header-bg-variant="success"
      bg-variant="light"
      border-variant="success"
      class="mx-1 px-0 my-2"
    >
      <template #header>
        <div>Selected Commodities</div>
      </template>
      {{ feasibilityCasesComputed }}
      {{ cropListByMonth }}
      {{ selectedMonth }}
      {{ selectedMonthComputed }}
      <b-button size="sm" variant="info" @click="showFctDialogue"
        >add new candidate</b-button
      >

      <b-list-group>
        <b-list-group-item
          v-for="(crop, index) in cropListByMonth"
          :key="index"
        >
          <div class="d-flex justify-content-between">
            <span>{{ crop }}</span>
            <span>
              <b-button
                :disabled="!selectedNutrientComputed || !selectedMonthComputed"
                size="sm"
                variant="info"
                @click="showFctDialogue"
                >remove
              </b-button>
            </span>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <fct-box-modal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="fctFilterByMonth"
      @modalOk="
        onCropSelected($event, {
          month: selectedMonthComputed,
        })
      "
    />
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
// import fctTableModal from '@/components/organisms/FctTableModal'
import fctBoxModal from '@/components/molecules/FctBoxModal'

/**
 * #月ごとの優先作物の選定
 * ３つのParamに対して、値を選択してemit
 * 1. selectedMonth
 * 1. selectedNutrient
 * 1. feasibilityCases
 */
export default {
  name: 'PriorityCommodity',
  components: {
    fctBoxModal,
  },
  props: {
    /**
     * 評価対象となる月
     */
    selectedMonth: {
      type: String,
      required: true,
    },
    /**
     * 評価対象となる栄養素
     */
    selectedNutrient: {
      type: String,
      required: true,
    },
    /**
     * 食品成分表
     */
    fct: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          Carbohydrate: Number,
          En: Number,
          Fe: Number,
          Fat: Number,
          Food_grp: String,
          Name: String,
          Pr: Number,
          Va: Number,
          Group: String,
          food_grp_id: String,
          id: String,
        }),
      }),
    },
    /**
     * 作物カレンダー
     */
    cropCalendar: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          1: String,
          2: String,
          3: String,
          4: String,
          5: String,
          6: String,
          7: String,
          8: String,
          9: String,
          10: String,
          11: String,
          12: String,
          FCT_id: String,
          Group: String,
          Name: String,
          id: String,
        }),
      }),
    },
    /**
     * 優先作物一覧
     */
    feasibilityCases: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          target: {
            type: Array,
            required: true,
            validator: arrayValidator({
              type: Object,
              validator: objectValidator({
                id: String,
                count: Number,
              }),
            }),
          },
          selectedCrop: {
            type: Object,
            validator: objectValidator({
              Carbohydrate: Number,
              En: Number,
              Fe: Number,
              Fat: Number,
              Pr: Number,
              Va: Number,
              Food_grp: String,
              Name: String,
              Group: String,
              food_grp_id: String,
              id: String,
            }),
          },
          note: {
            type: String,
            default: '',
          },
          ansList: {
            type: Array,
            default: () => [
              -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99,
            ],
          },
          familyId: {
            type: String,
          },
          month: {
            type: String,
          },
          caseId: {
            type: String,
          },
        }),
      }),
    },
    /**
     * 対象家族の構成
     */
    familyMember: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          id: String,
          count: Number,
        }),
      }),
    },
    /**
     * 対象家族のID
     */
    familyId: {
      type: String,
      required: true,
    },
    /**
     * 月の表示オプション
     */
    monthOptions: {
      type: Array,
      default: () => {
        return [
          { value: '1', text: 'Jan' },
          { value: '2', text: 'Feb' },
          { value: '3', text: 'Mar' },
          { value: '4', text: 'Apr' },
          { value: '5', text: 'May' },
          { value: '6', text: 'Jun' },
          { value: '7', text: 'Jul' },
          { value: '8', text: 'Aug' },
          { value: '9', text: 'Sep' },
          { value: '10', text: 'Oct' },
          { value: '11', text: 'Nov' },
          { value: '12', text: 'Dec' },
        ]
      },
    },
    /**
     * 栄養素名の表示オプション
     */
    nutrientOptions: {
      type: Array,
      default: () => {
        return [
          { text: 'Energy', value: 'En' },
          { text: 'Protein', value: 'Pr' },
          { text: 'Vitamin A', value: 'Va' },
          { text: 'Iron', value: 'Fe' },
        ]
      },
    },
  },
  data() {
    return {
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
      /**
       * 現在入力中の作物リストのid
       */
      addCropId: -1,
    }
  },
  computed: {
    cropListByMonth: {
      get() {
        const vm = this
        if (vm.feasibilityCasesComputed.length === -1) {
          return []
        }
        const res = vm.feasibilityCasesComputed.filter((item) => {
          return item.month === vm.selectedMonthComputed
        })
        if (!res) {
          return []
        } else {
          return res.map((item2) => {
            return item2.selectedCrop.Name
          })
        }
      },
    },
    fctFilterByMonth() {
      if (this.selectedMonthComputed === -1) {
        return JSON.parse(JSON.stringify(this.fct))
      }
      const filteredId = this.cropCalendar
        .filter(
          (item) =>
            item[this.selectedMonthComputed] === '1' ||
            item[this.selectedMonthComputed] === '2'
        )
        .map((item2) => {
          return item2.FCT_id
        })
      return this.fct.filter((item) => filteredId.includes(item.id))
    },
    selectedNutrientComputed: {
      get() {
        return this.selectedNutrient
      },
      set(val) {
        this.$emit('update:selectedNutrient', val)
      },
    },
    selectedMonthComputed: {
      get() {
        return this.selectedMonth
      },
      set(val) {
        this.$emit('update:selectedMonth', val)
      },
    },
    feasibilityCasesComputed: {
      get() {
        return this.feasibilityCases
      },
      set(val) {
        this.$emit('update:feasibilityCases', val)
      },
    },
  },
  methods: {
    /**
     * fctダイアログのトリガー
     */
    showFctDialogue() {
      if (this.fctFilterByMonth.length === 0) {
        alert('there is no available crop for this month')
        return
      }
      this.showFct = !this.showFct
    },
    /**
     * cropの選択した値をもとにデータ更新
     * @param val
     * @param options
     */
    onCropSelected(val, options) {
      const vm = this
      // 選択された作物の重量を100gにセット
      val.Wt = 100
      // feasibilityCases全体を更新する場合
      const returnValue = JSON.parse(
        JSON.stringify(vm.feasibilityCasesComputed)
      ).push({
        target: JSON.parse(JSON.stringify(vm.familyMember)),
        selectedCrop: val,
        note: '',
        ansList: [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99],
        familyId: vm.familyId,
        month: vm.selectedMonth,
        caseId: vm.familyId + '_' + vm.selectedMonth + '_' + val.id,
      })
      this.$emit('update:feasibilityCases', returnValue)
      this.$emit('changeCrop', {
        month: options.month,
        index: options.index,
        selectedCrop: val,
      })
    },
  },
}
</script>
