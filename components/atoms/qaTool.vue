<template>
  <b-container class="px-0" style="max-width: 540px">
    <!--  ここから質問項目のはじまり  -->
    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        {{ qaList.qaTitle }}
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mx-0">
        <!--
         qaListの項目に沿って質問と回答一案（ドロップダウン）を表示
         項目のインデックスが0の時だけNutritionBarを表示
           -->
        <b-card
          v-for="(qaGroup, index) in qaList.categoryList"
          :key="index"
          style="min-width: 530px"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2"
        >
          <template #header>
            <div>{{ qaGroup.category }}</div>
          </template>

          <ul class="pl-2 my-0">
            <li
              v-for="(qa, index2) in qaGroup.questionList"
              :key="index2"
              :class="{ 'mt-3': index2 !== 0 }"
            >
              <!--    追加項目の表示      -->
              <slot
                v-if="
                  extraComponentFlag.includes(
                    qaGroup.categoryId + '_' + qa.questionId
                  )
                "
                name="extraContents"
              ></slot>

              {{ qa.questionText }}
              <b-form-select
                :value="
                  answerListComputed.filter((item) => {
                    return (
                      item.categoryId === qaGroup.categoryId &&
                      item.questionId === qa.questionId
                    )
                  })
                "
                :options="
                  qa.answerOptions.map((item) => {
                    return {
                      text: item.optionText,
                      value: {
                        categoryId: qaGroup.categoryId,
                        questionId: qa.questionId,
                        score: item.optionScore,
                        optionId: item.optionId,
                      },
                    }
                  })
                "
                size="sm"
                @change="onAnswerChanged($event)"
              />
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'

/**
 * 与えられた質問セットに応じて質問項目と回答候補一覧（ドロップダウン）を表示
 * ユーザーが解答を選択するごとに変更内容をemit
 */
export default {
  components: {},
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
     * 表示項目に応じて追加コンポーネントを表示するためのフラグ
     */
    extraComponentFlag: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    answerListComputed() {
      return this.answerList
    },
  },
  methods: {
    onAnswerChanged(val) {
      const vm = this
      const res = JSON.parse(JSON.stringify(vm.answerList))
      const index = res.findIndex(
        (item) =>
          item.categoryId === val.categoryId &&
          item.questionId === val.questionId
      )
      res.splice(index, 1, val)
      this.$emit('update:answerList', res)
    },
  },
}
</script>
