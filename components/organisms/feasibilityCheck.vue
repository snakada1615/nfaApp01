<template>
  <b-container>
    <div>
      identified nutrient gap:<span class="text-danger font-weight-bold">{{
        selectedMonth
      }}</span>
    </div>
    <div>
      selected month:<span class="text-danger font-weight-bold">{{
        selectedNutrient
      }}</span>
    </div>

    <!--   ページ情報とページの切り替え   -->
    <b-row class="d-flex justify-content-center">
      <b-card border-variant="light" style="width: 590px">
        <b-row class="mt-2">
          <b-col
            class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold"
          >
            Feasibility assessment result
            <b-form-select v-model="cropName" :options="cropList" />
            <div class="d-flex flex-row">
              <b-form-input
                :value="feasibilityCaseByMonth.note"
                placeholder="memo for this page"
                class="my-1"
              />
            </div>
          </b-col>
        </b-row>
      </b-card>
      <feasibility-check-unit
        :target-info="feasibilityCaseSelected.targetInfo"
        :qa-list="qaList"
        :answer-list="feasibilityCaseSelected.answerList"
        :crop-name="cropName"
        :extra-component-flag="['a1_a1-02']"
      />
    </b-row>
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import FeasibilityCheckUnit from '@/components/organisms/feasibilityCheckUnit'

export default {
  name: 'FeasibilityCheck',
  components: {
    FeasibilityCheckUnit,
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
     * 優先作物一覧
     */
    feasibilityCases: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          familyId: {
            type: String,
          },
          month: {
            type: String,
          },
          caseId: {
            type: String,
          },
          /**
           * 回答一覧
           */
          answerList: {
            type: Array,
            required: true,
            validator: arrayValidator({
              categoryId: String,
              questionId: String,
              optionId: String,
              score: Number,
            }),
          },
          /**
           * 表示項目に応じてnamed slotを表示するためのフラグ
           */
          extraComponentFlag: {
            type: Array,
            default: () => [],
          },
          /**
           * * targetCommodity: 対象品目
           * * targetNutrition: 対象栄養素
           * * nutritionGap: 現在の栄養素ギャップ
           * * prodTarget: 摂取目標
           *   - Wt 1日あたり目標
           *   - Wt365 1年あたり目標
           *   - share 対象品目での摂取目標（栄養ギャップにしめる比率）
           */
          targetInfo: {
            type: Object,
            required: true,
            validator: objectValidator({
              targetCommodity: {
                type: String,
                required: true,
              },
              targetNutrition: {
                type: String,
                required: true,
              },
              nutritionGap: {
                type: Number,
                required: true,
              },
              prodTarget: {
                Wt: Number,
                Wt365: Number,
                share: Number,
              },
            }),
          },
        }),
      }),
    },
    /**
     * 質問と回答optionの一覧
     */
    qaList: {
      type: Object,
      required: true,
      validator: objectValidator({
        qaTitle: String,
        totalScore: Number,
        categoryList: Array,
        required: true,
        validator: arrayValidator({
          type: Object,
          validator: objectValidator({
            category: String,
            categoryId: String,
            categoryScore: Number,
            questionList: Array,
            validator: arrayValidator({
              type: Object,
              validator: objectValidator({
                questionText: String,
                questionId: String,
                ansState: Boolean,
                singleScore: Number,
                answerOptions: Array,
                validator: arrayValidator({
                  optionText: String,
                  optionScore: Number,
                  optionId: String,
                }),
              }),
            }),
          }),
        }),
      }),
    },
  },
  data() {
    return {
      cropName: '',
    }
  },
  computed: {
    feasibilityCaseByMonth() {
      const vm = this
      return vm.feasibilityCases.filter(
        (item) => item.month === vm.selectedMonth
      )
    },
    feasibilityCaseSelected() {
      return this.feasibilityCaseByMonth.find(
        (item) => item.targetInfo.targetCommodity === this.cropName
      )
    },
    cropList() {
      return this.feasibilityCaseByMonth.map((item) => {
        return item.targetInfo.targetCommodity
      })
    },
    answerList() {
      return this.feasibilityCaseByMonth.map((item) => {
        return item.answerList
      })
    },
    targetInfo() {
      return this.feasibilityCaseByMonth()
    },
    nutrientGap() {
      const vm = this
      return this.nutrientGaps.find((item) => item.nutrient === vm.cropName).gap
    },
  },
}
</script>

<style scoped></style>
