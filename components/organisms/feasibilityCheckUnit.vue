<template>
  <b-container>
    <display-result :feasibility-result="feasibilityResult" />
    <qa-tool
      :answer-list.sync="answerListComputed"
      :qa-list="qaListComputed"
      :extra-component-flag="slotComputed"
    >
      <template #extraContents>
        <show-target-volume
          :target-info.sync="targetInfoComputed"
          :extra-component-flag="extraComponentFlag"
        />
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
  name: 'FeasibilityCheckUnit',
  components: {
    displayResult,
    qaTool,
    showTargetVolume,
  },
  props: {
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
     * 対象作物名
     */
    cropName: {
      type: String,
      required: true,
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
  },
  computed: {
    answerListComputed: {
      get() {
        return this.answerList
      },
      set(val) {
        this.$emit('update:answerList', val)
      },
    },
    slotComputed: {
      get() {
        return this.extraComponentFlag
      },
    },
    scoreList() {
      const vm = this
      return vm.answerListComputed.reduce((accumulator, currentItem) => {
        if (accumulator[currentItem.categoryId]) {
          accumulator[currentItem.categoryId] += currentItem.score
        } else {
          accumulator[currentItem.categoryId] = currentItem.score
        }
        if (accumulator.totalScore) {
          accumulator.totalScore += currentItem.score
        } else {
          accumulator.totalScore = currentItem.score
        }
        return accumulator
      }, {})
    },
    categoryScore() {
      return Object.entries(this.scoreList)
        .filter((item) => item[0] !== 'totalScore')
        .map((item) => {
          return {
            title: item[0],
            score: item[1],
          }
        })
    },
    totalScore() {
      return this.scoreList.totalScore
    },
    /**
     * feasibility questionの回答に応じて集計されたスコア
     */
    feasibilityResult() {
      return {
        cropName: this.cropName,
        totalScore: this.totalScore,
        maxScore: 60,
        categoryScore: this.categoryScore,
      }
    },
    qaListComputed() {
      return this.qaList
    },
    targetInfoComputed: {
      get() {
        return this.targetInfo
      },
      set(val) {
        this.$emit('update:targetInfo', val)
      },
    },
  },
}
</script>

<style scoped></style>
