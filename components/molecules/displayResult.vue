<template>
  <b-container>
    <!--   スコアの総括票     -->
    <b-card
      header-bg-variant="success"
      bg-variant="light"
      border-variant="success"
      class="mx-1 px-0 my-2"
    >
      <template #header>
        <div class="font-weight-bolder text-white">
          {{ resultComputed.cropName || 'not selected' }}
        </div>
      </template>
      <b-row>
        <b-col cols="6"> Crop name: </b-col>
        <b-col cols="6" class="text-info">
          {{ resultComputed.cropName || 'not selected' }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6"> total score: </b-col>
        <b-col cols="6">
          {{ resultComputed.totalScore }} /
          {{ resultComputed.maxScore }}
        </b-col>
      </b-row>
      <b-row v-for="(qa, index1) in resultComputed.categoryScore" :key="index1">
        <b-col>
          <nutrition-bar :label="qa.title" :rating="qa.score" />
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import nutritionBar from '@/components/molecules/nutritionBar'

/**
 * feasibnilityテストの結果を受け取って表示するだけ
 */
export default {
  name: 'FeasibilityResultBox',
  components: {
    nutritionBar,
  },
  props: {
    feasibilityResult: {
      type: Object,
      required: true,
      validator: objectValidator({
        cropName: String,
        totalScore: Number,
        maxScore: Number,
        categoryScore: {
          type: Array,
          required: true,
          validator: arrayValidator({
            type: Object,
            validator: objectValidator({
              title: String,
              score: Number,
            }),
          }),
        },
      }),
    },
  },
  computed: {
    resultComputed() {
      return this.feasibilityResult
    },
  },
}
</script>

<style scoped></style>
