<template>
  <b-container>
    <!-- このテーブルで年齢・性別群ごとの対象人数を入力する   -->
    <b-table
      class="jest_table"
      striped
      bordered
      head-row-variant="success"
      table-variant="light"
      :fixed="true"
      :items="targetComputed"
      :fields="fieldDRI"
      :sort-by.sync="sortBy"
      small
    >
      <template #cell(count)="data">
        <b-form-input
          :value="data.item.count"
          :state="statusPopulationNumber(data.item.count)"
          type="number"
          size="sm"
          @change="updateTarget(data.item.id, $event)"
        ></b-form-input>
      </template>
    </b-table>

    <!--  このテーブルは栄養必要量の合計  -->
    <b-table
      class="jest_table"
      striped
      bordered
      small
      :fixed="true"
      head-row-variant="success"
      table-variant="light"
      :items="nutritionDemand"
      :fields="fieldTableDri"
    >
      <template #cell(Value)="data">
        <span class="text-info">{{
          formatNumber(data.value, data.index)
        }}</span>
      </template>
    </b-table>
    KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import { setDigit, getNutritionDemand } from '@/plugins/helper'

/**
 * - 対象となる年齢、性別、人数を設定することで、当該グループの栄養必要量をemit
 */
export default {
  props: {
    /**
     * ターゲットグループの構成：v-modelで使用
     *   [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]
     */
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
    /**
     *  driのデータセット
     *   ex.
     *          [{
     *            En: "1088.0",
     *            Fe: "5.8",
     *            max_vol: "900",
     *            Name: "child 6-23 month",
     *            Pr: "11.65",
     *            Va: "400.0",
     *            id: 0
     *           }],
     */
    driItems: {
      type: Array,
      default: () => [],
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          id: String,
          En: Number,
          Pr: Number,
          Va: Number,
          max_vol: Number,
          Name: String,
        }),
      }),
    },
    /**
     * target.countの上限値
     */
    max: {
      type: Number,
      default: 1000000,
    },
  },
  data() {
    return {
      /**
       * 家族構成表示用のフィールド定義
       */
      fieldDRI: [
        { key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Name', sortable: false },
        { key: 'count', sortable: false },
      ],
      /**
       * sortのためのkey列を定義
       */
      sortBy: 'id',
      /**
       * 栄養必要量の合計値を示すテーブルのフィールド定義
       */
      fieldTableDri: [
        { key: 'Item', sortable: false },
        { key: 'Value', sortable: false },
      ],
    }
  },
  computed: {
    targetComputed: {
      get() {
        const vm = this
        return vm.driItems.map((item) => {
          // targetで人数が設定されている場合はそれを利用、それ以外は0を設定
          const res = vm.target.find((sameId) => sameId.id === item.id)
          item.count = res ? res.count : 0

          return {
            id: item.id,
            Name: item.Name,
            count: item.count,
          }
        })
      },
      // set(val) {
      //   // targetの変更内容を親コンポーネントにemit
      //   this.$emit(
      //     'update:target',
      //     val.forEach((item) => {
      //       return {
      //         id: item.id,
      //         count: item.count,
      //       }
      //     })
      //   )
      // },
    },
    nutritionDemand() {
      const vm = this
      const res = getNutritionDemand(vm.target, vm.driItems)
      return [
        { Item: 'target', Value: 'mixed' },
        { Item: 'Energy', Value: res.En },
        { Item: 'Protein', Value: res.Pr },
        { Item: 'Vit_A', Value: res.Va },
        { Item: 'Iron', Value: res.Fe },
        { Item: 'id', Value: 0 },
      ]
    },
  },
  methods: {
    updateTarget(index, val) {
      // targetの変更内容を親コンポーネントにemit
      const vm = this
      this.$emit(
        'update:target',
        vm.targetComputed.map((item) => {
          let countTemp = item.count
          if (index === item.id) {
            countTemp = val
          }
          return {
            id: item.id,
            count: countTemp,
          }
        })
      )
    },
    /**
     * 栄養必要量の表記フォーマット
     * @param val 変換前の数値
     * @param index 変換パターン
     * @returns {string|*} 戻り値（テキスト）
     */
    formatNumber(val, index) {
      if (index === 0) {
        return 'mixed'
      }
      if (index === 5) {
        return val
      }
      return setDigit(val, index - 1)
    },
    /**
     * population入力値のバリデーション
     * @param val 入力値
     * @returns {boolean} バリデーション結果
     */
    statusPopulationNumber(val) {
      return val >= 0 && val <= this.max
    },
  },
}
</script>
