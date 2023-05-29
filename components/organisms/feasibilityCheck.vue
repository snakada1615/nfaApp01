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
        :target-info="targetInfo"
        :qa-list="qaList"
        :answer-list="answerList"
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
           * feasibility Questionへの回答一覧
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
    /**
     * 栄養素ギャップ
     */
    nutrientGaps: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          nutrient: String,
          gap: Number,
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
    cropList() {
      return this.feasibilityCaseByMonth.map((item) => {
        return item.selectedCrop.Name
      })
    },
    answerList() {
      return this.feasibilityCaseByMonth.map((item) => {
        return item.answerList
      })
    },
    targetInfo() {
      const vm = this
      const current = vm.feasibilityCaseByMonth.find(
        (item) => item.selectedCrop.Name === vm.targetCommodity
      )
      return {
        targetCommodity: current.targetCommodity,
        targetNutrition: vm.selectedNutrient,
        nutritionGap: 159,
        prodTarget: current.prodTarget,
      }
    },
    nutrientGap() {
      const vm = this
      return this.nutrientGaps.find((item) => item.nutrient === vm.cropName).gap
    },
  },
}
</script>

<style scoped></style>
