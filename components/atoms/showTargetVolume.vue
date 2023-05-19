<template>
  <b-container>
    <div class="font-weight-bold">
      Target nutrient:
      <span class="text-info">{{ targetInfoComputed.targetNutrition }}</span>
    </div>
    <div class="font-weight-bold">
      Current nutrient gap:
      <span class="text-info">{{ targetInfoComputed.nutritionGap }}</span>
    </div>
    <div class="font-weight-bold mb-2">
      Sufficiency target: <span class="text-danger">{{ share }}%</span>
      <b-form-input
        id="range-1"
        :value="share"
        type="range"
        min="10"
        max="100"
        @change="onChange"
      ></b-form-input>
    </div>
    <hr />
    <div class="font-weight-bold">
      Candidate commodity:
      <span class="text-info">{{ targetInfoComputed.targetCommodity }}</span>
    </div>
    <div class="font-weight-bold">
      Daily requirement:
      <span class="text-danger">
        {{
          setDigit(
            targetInfoComputed.prodTarget.Wt,
            nutrientType[targetInfoComputed.targetNutrition]
          )
        }}
      </span>
    </div>
    <div class="font-weight-bold mb-2">
      Annual Requirement:
      <span class="text-danger">
        {{
          setDigit(
            targetInfo.prodTarget.Wt365,
            nutrientType[targetInfoComputed.targetNutrition]
          )
        }}
      </span>
    </div>
  </b-container>
</template>

<script>
import { objectValidator } from 'vue-props-validation'
import { setDigit } from '@/plugins/helper'

/**
 * 栄養素ギャップとshare目標値に応じて1日あたり、一年あたりの摂取量目標を示す
 */
export default {
  name: 'ShowTargetVolume',
  props: {
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
  data() {
    return {
      nutrientType: { Energy: 0, Protein: 1, VitA: 2, Iron: 3 },
    }
  },
  computed: {
    targetInfoComputed() {
      return this.targetInfo
    },
    share: {
      get() {
        return this.targetInfo.prodTarget.share
      },
    },
  },
  methods: {
    setDigit(val, key) {
      return setDigit(val, key)
    },
    onChange(val) {
      const info = this.targetInfoComputed
      this.$emit('update:targetInfo', {
        targetCommodity: info.targetCommodity,
        targetNutrition: info.targetNutrition,
        nutritionGap: info.nutritionGap,
        prodTarget: {
          Wt: (info.prodTarget.share * val) / 100,
          Wt365: (info.prodTarget.share * val * 365) / 100,
          share: val,
        },
      })
    },
  },
}
</script>

<style scoped></style>
