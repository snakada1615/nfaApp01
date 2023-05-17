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
          <!-- 対象栄養素の選択 -->
          <div>target nutrient</div>
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
          <!-- 対象月の選択 -->
          <div>Month</div>
          <b-form-select
            v-model="selectedMonthComputed"
            :options="monthOptions"
          />
        </b-col>
      </b-row>
    </b-card>

    <!-- 選択された優先作物の一覧 -->
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

      <!-- 追加ボタン -->
      <b-button
        size="sm"
        variant="info"
        block
        class="my-2"
        @click="showFctDialogue({ mode: 0, caseId: '' })"
        >add new candidate commodity
      </b-button>

      <!-- 既存の優先品目一覧 -->
      <div v-if="cropListByMonth.length === 0">
        <div class="mx-auto bg-warning">no crop selected yet</div>
      </div>

      <b-list-group>
        <b-list-group-item
          v-for="(crop, index) in cropListByMonth"
          :key="index"
        >
          <div class="d-flex justify-content-between">
            <span>{{ crop.selectedCrop.Name }}</span>
            <span>
              <!-- 優先品目の変更 -->
              <b-button
                :disabled="!selectedNutrientComputed || !selectedMonthComputed"
                size="sm"
                variant="info"
                @click="
                  showFctDialogue({ mode: 1, caseId: crop.selectedCrop.id })
                "
                >change
              </b-button>

              <!-- 優先品目の削除 -->
              <b-button
                :disabled="!selectedNutrientComputed || !selectedMonthComputed"
                size="sm"
                variant="warning"
                @click="
                  showFctDialogue({ mode: 2, caseId: crop.selectedCrop.id })
                "
                >delete
              </b-button>
            </span>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>

    <!-- 品目編集用のModal -->
    <fct-box-modal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="fctFilterByMonth"
      @modalOk="onCropSelected($event, dialogOption)"
    />
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import fctBoxModal from '@/components/molecules/FctBoxModal'

/**
 * #月ごとの優先作物の選定
 * ３つのParamに対して、値を選択してemit
 * 1. selectedMonth
 * 2. selectedNutrient
 * 3. feasibilityCases
 *
 * 補足的に必要なParam
 * * 対象家族の構成(document該当箇所と紐付けのため)
 * * 対象家族のID(document該当箇所と紐付けのため)
 * * FCT
 * * 作物カレンダー
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
          /**
           * 家族構成
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
           * 選択した優先品目
           */
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
          /**
           * 優先品目の生産目標
           */
          prodTarget: {
            Wt: Number,
            Wt365: Number,
            share: Number,
          },
          note: {
            type: String,
            default: '',
          },
          /**
           * feasibility Questionへの回答
           */
          ansList: {
            type: Array,
            default: () => [
              -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99,
            ],
          },
          /**
           * 対象家族のID
           */
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
     * 対象家庭の情報
     */
    familyInfo: {
      type: Object,
      required: true,
      validate: objectValidator({
        /**
         * 家族構成
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
        },
      }),
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
       *
       */
      dialogOption: '',
      /**
       * 現在入力中の作物リストのid
       */
      addCropId: -1,
    }
  },
  computed: {
    /**
     * 対象家族のID
     */
    familyId() {
      console.log(this.familyInfo)
      return this.familyInfo.familyId
    },
    /**
     * 対象家族の構成
     */
    familyMember() {
      return this.familyInfo.familyMember
    },
    /**
     * property（selectedNutrient）をリアクティブにするため
     */
    selectedNutrientComputed: {
      get() {
        return this.selectedNutrient
      },
      set(val) {
        this.$emit('update:selectedNutrient', val)
      },
    },
    /**
     * property（selectedMonth）をリアクティブにするため
     */
    selectedMonthComputed: {
      get() {
        return this.selectedMonth
      },
      set(val) {
        this.$emit('update:selectedMonth', val)
      },
    },
    /**
     * property（feasibilityCases）をリアクティブにするため
     */
    feasibilityCasesComputed: {
      get() {
        return this.feasibilityCases
      },
      set(val) {
        this.$emit('update:feasibilityCases', val)
      },
    },
    /**
     * feasibilityCaseを対象月で絞り込み
     */
    cropListByMonth: {
      get() {
        const vm = this
        if (vm.feasibilityCasesComputed.length === -1) {
          return []
        }
        return vm.feasibilityCasesComputed.filter((item) => {
          return item.month === vm.selectedMonthComputed
        })
      },
    },
    /**
     * fctを対象月で絞り込み
     * @returns {*[]|any}
     */
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
  },
  methods: {
    /**
     * fctダイアログのトリガー
     */
    showFctDialogue(param = '') {
      if (this.fctFilterByMonth.length === 0) {
        alert('there is no available crop for this month')
        return
      }
      this.dialogOption = param
      /**
       * 削除モードの場合はダイアログを開かず削除処理に移る
       */
      if (param.mode === 2) {
        this.onCropSelected([], param)
        return
      }
      this.showFct = !this.showFct
    },
    /**
     * cropの選択した値をもとにデータ更新(追加、変更、削除の３パターン)
     * @param val
     * @param dialogOption {mode: [0: 追加, 1: 修正, 2:削除]}
     */
    onCropSelected(val, dialogOption) {
      const vm = this

      // feasibilityCases更新用のoriginalコピーを作成
      let returnValue = []
      returnValue = JSON.parse(JSON.stringify(vm.feasibilityCases))

      // feasibilityCases更新用のnewValueを作成
      const newValue = {
        familyMember: JSON.parse(JSON.stringify(vm.familyMember)),
        selectedCrop: val,
        prodTarget: {
          Wt: 100,
          Wt365: 36500,
          share: 100,
        },
        ansList: [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99],
        note: '',
        familyId: vm.familyId,
        month: vm.selectedMonth,
        caseId: dialogOption.caseId
          ? dialogOption.caseId
          : vm.familyId + '_' + vm.selectedMonth + '_' + val.id,
      }

      switch (dialogOption.mode) {
        case 0:
          returnValue.push(newValue)
          break

        case 1: {
          const searchIndex = returnValue.findIndex((item) => {
            return item.caseId === dialogOption.caseId
          })

          if (searchIndex) {
            // マッチしている場合
            returnValue.splice(searchIndex, 1, newValue)
          } else {
            // 見つからなかった場合は追加更新で
            returnValue.push(newValue)
          }
          break
        }

        case 2: {
          returnValue = returnValue.filter((item) => {
            return item.caseId !== dialogOption.caseId
          })
          break
        }
      }

      vm.$emit('update:feasibilityCases', returnValue)
      if (dialogOption.mode !== 2) {
        vm.$emit('changeCrop', {
          month: vm.selectedMonth,
          familyId: vm.familyId,
          caseId: dialogOption.caseId,
          selectedCrop: val,
        })
      }
    },
  },
}
</script>
