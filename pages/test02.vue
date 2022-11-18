<template>
  <b-container>
    <b-table
      small
      stripped
      responsive
      :items="member"
      :fields="fieldTableDri"
    >
      <template #cell(number)="data">
        <div class="d-flex justify-content-around">
          <b-icon icon="BIconDashCircleFill" class="mx-2" style="cursor: pointer" @click="test"/>
          {{data.item.number}}
          <b-icon icon="BIconPlusCircleFill" class="mx-2" style="cursor: pointer" @click="test"/>
        </div>
      </template>
    </b-table>
    <b-card>
      myApp{{member}}
      myFamily
    </b-card>
  </b-container>
</template>

<script>
import { makeToast } from "@/plugins/helper";

export default {
  name: "MyTest02",
  data() {
    return {
      /**
       * 表示用のフィールド定義
       */
      fieldDRI: [
        {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'name', sortable: false},
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
        {key: 'name', sortable: false},
        {key: 'number', sortable: false},
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
  computed: {
    member:{
      get(){
        return this.$store.getters["fire/initialMembers"]
      }
    }
  },
  methods: {
    test(){
      makeToast(this,'this day')
    }
  }
};
</script>

<style scoped>

</style>
