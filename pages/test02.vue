<template>
  <b-container>

    <update-family
      :member.sync="tablePop"
      :dri="$store.state.fire.driObject"
    />
  </b-container>
</template>

<script>
import { makeToast } from "@/plugins/helper";
import updateFamily from "@/components/molecules/updateFamily";

export default {
  name: "MyTest02",
  components: {
    updateFamily
  },
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
      temp: 2,
      temp2 : {
        jingle: 'bell'
      }
    }
  },
  computed: {
  },
  created() {
    this.tablePop = JSON.parse(JSON.stringify(this.$store.getters['fire/initialMembers']))
  },
  methods: {
    test(val){
      makeToast(this,'this day')
      console.log(val)
    }
  }
};
</script>
