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
            <b-form-select
              v-model="selectedFeasibilityCase"
              :options="feasibilityCaseByMonth"
            />
            <div class="d-flex flex-row">
              <b-form-input
                v-model="feasibilityPageMemo"
                placeholder="memo for this page"
                :state="stateMemoInput"
                class="my-1"
              />
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-row>

    <display-result feasibility-result="" />
    <qa-tool answer-list="" qa-list="">
      <template #extraContents>
        <show-target-volume target-info="" />
      </template>
    </qa-tool>
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import displayResult from '@/components/molecules/displayResult'
import qaTool from '@/components/atoms/qaTool'
import showTargetVolume from '@/components/atoms/showTargetVolume'

export default {
  name: 'FeasibilityCheck',
  components: {
    displayResult,
    qaTool,
    showTargetVolume,
  },
  props: {
    /**
     * 評価対象となる家族
     * 家族情報と優先品目を紐づけるためのproperty
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
        /**
         * 対象家族名
         */
        familyName: {
          type: String,
        },
      }),
    },
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
  },
  computed: {
    feasibilityCaseByMonth() {
      const vm = this
      return vm.feasibilityCases.filter(
        (item) => item.month === vm.selectedMonth
      )
    },
  },
}
</script>

<style scoped></style>
