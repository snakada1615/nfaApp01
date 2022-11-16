<template>
  <b-container>
    halo
    <b-table
      small
      :items="$store.state.fire.dri"
      :fields="fieldTableDri"
    ></b-table>
    <b-card>
      myApp
      {{$store.state.fire.dri}}
      myFamily
      {{$store.state.fire.families}}
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "MyTest02",
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
        {key: 'Name', sortable: false},
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
