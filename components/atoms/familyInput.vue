<template>
<b-container>
  <!-- このテーブルで年齢・性別群ごとの対象人数を入力する   -->
  <b-table
    striped
    bordered
    head-row-variant="success"
    table-variant="light"
    :fixed=true
    :items="tablePop"
    :fields="fieldDRI"
    :sort-by.sync="sortBy"
    small
  >

  </b-table>

</b-container>
</template>

<script>
export default {
  name: "FamilyInput",
  props: {
    /**
     * ターゲットグループの構成：v-modelで使用
     *   [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]
     */
    target: {
      type: Array,
      required: true
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
      required: true
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
        {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Name', sortable: false},
        {key: 'number', sortable: false},
      ],
      /**
       * sortのためのkey列を定義
       */
      sortBy: 'id',
      /**
       * 栄養必要量の合計値を示すテーブルのフィールド定義
       */
      fieldTableDri: [
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
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
};
</script>

<style scoped>

</style>
