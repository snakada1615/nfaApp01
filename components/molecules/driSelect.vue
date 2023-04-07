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
      :items="tablePop"
      :fields="fieldDRI"
      :sort-by.sync="sortBy"
      small
    >
      <template #cell(number)="data">
        <b-form-input
          v-model="data.item.number"
          :state="statusPopulationNumber(data.item.number)"
          type="number"
          size="sm"
          @input="$emit('update:target', tablePop2Target(tablePop))"
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
      :items="tableDri"
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
import { setDigit } from '@/plugins/helper'

/**
 * @desc 対象となる年齢、性別、人数を選択することで、当該グループの栄養必要量をemit
 */
export default {
  props: {
    /**
     * ターゲットグループの構成：v-modelで使用
     *   [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]
     */
    target: {
      type: Array,
      default: () => [{ id: 0, count: 1 }],
      required: true,
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
       * 表示用のフィールド定義
       */
      fieldDRI: [
        { key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Name', sortable: false },
        { key: 'number', sortable: false },
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
      /**
       * 最初のテーブルを埋めるデータ（年齢・性別毎の人数）
       */
      tablePop: [],
      /**
       * 2番目のテーブルを埋めるデータ（栄養素毎の合計必要量）
       */
      tableDri: [],
    }
  },
  watch: {
    target: {
      deep: true,
      immediate: true,
      handler() {
        this.updateAllTable()
      },
    },
  },
  methods: {
    /**
     * 栄養必要量の表記フォーマット
     * @param val 変換前の数値
     * @param index 変換パターン
     * @returns {string|*} 戻り値（テキスト）
     */
    formatNumber(val, index) {
      console.log(val)
      console.log(index)
      if (index === 0) {
        return 'mixed'
      }
      if (index === 5) {
        return val
      }
      return setDigit(val, index)
    },
    /**
     * population入力値のバリデーション
     * @param val 入力値
     * @returns {boolean} バリデーション結果
     */
    statusPopulationNumber(val) {
      return val >= 0 && val <= this.max
    },
    /**
     * targetプロパティの更新時に内部変数 (tablePop, tableDri)を更新
     */
    updateAllTable() {
      this.tablePop.length = 0
      this.tablePop = JSON.parse(
        JSON.stringify(this.updateTablePop(this.driItems, this.target))
      )
      this.tableDri.length = 0
      this.tableDri = JSON.parse(
        JSON.stringify(this.updateTableDri(this.tablePop))
      )
      const res = {}
      this.tableDri.forEach(function (val) {
        res[val.Item] = val.Value
      })
      const res2 = {
        En: Number(res.Energy),
        Pr: Number(res.Protein),
        Va: Number(res.Vit_A),
        Fe: Number(res.Iron),
      }
      /**
       * 必要栄養量の更新を親コンポーネントに通知
       */
      this.$emit('changeNutritionValue', { total: res2, target: this.target })
    },
    /**
     * DRIのテーブル（合計値）を更新
     * @param dat 年齢別の栄養素必要量＊人数のテーブル
     * @returns
     *     {[{Item: string, Value: string},
     *     {Item: string, Value: (number|*|number)},
     *     {Item: string, Value: (number|*|number)},
     *     {Item: string, Value: (number|*|number)},
     *     {Item: string, Value: (number|*|number)},
     *     null]}
     *     合計値のテーブル
     */
    updateTableDri(dat) {
      const result = {}
      result.En = 0
      result.Pr = 0
      result.Va = 0
      result.Fe = 0
      dat.forEach(function (value) {
        result.En += Number(value.En) * Number(value.number)
        result.Pr += Number(value.Pr) * Number(value.number)
        result.Va += Number(value.Va) * Number(value.number)
        result.Fe += Number(value.Fe) * Number(value.number)
      })
      return [
        { Item: 'target', Value: 'mixed' },
        { Item: 'Energy', Value: result.En },
        { Item: 'Protein', Value: result.Pr },
        { Item: 'Vit_A', Value: result.Va },
        { Item: 'Iron', Value: result.Fe },
        { Item: 'id', Value: 0 },
      ]
    },
    /**
     * DRIの一覧表（年齢別・性別）に各グループの人数を追加して戻す
     * @param driValue DRIの一覧表
     * @param targetValue 各グループの対象人数のリスト
     * @returns {*} DRIの一覧表×対象人数
     */
    updateTablePop(driValue, targetValue) {
      return driValue.map(function (driItem) {
        const res = targetValue.filter(
          (item) => Number(item.id) === Number(driItem.id)
        )
        driItem.number = res.length ? res[0].count : 0
        return driItem
      })
    },
    /**
     * tablePopをテーブルに表示するための整形
     * @param dat
     * @returns {*}
     */
    tablePop2Target(dat) {
      return dat.map(function (item) {
        return {
          id: item.id,
          count: Number(item.number),
        }
      })
    },
  },
}
</script>
