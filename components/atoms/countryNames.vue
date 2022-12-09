<template>
  <b-form-select
    :value="key1Temp"
    :options="countries"
    @change="$emit('update:key1', $event)"
  ></b-form-select>
</template>
<script>
/**
 * fireStoreから国一覧のリストを読み込んでform-selectで表示
 */
  export default{
    data() {
      return {
        /**
         * fireStoreから読み込んだデータ本体
         */
        dataObj: '',
      }
    },
    props: {
      /**
       * 選択された地域
       */
      key1: {
        type: String,
        required: true,
        default: ''
      },
    },
    computed: {
      key1Temp(){
        return this.key1
      },
      /**
       * dataObjをリストに変換(リストボックス用)
       * @returns []
       */
      countries: function () {
        if (this.dataObj.length === 0) {
          return []
        }
        return Object.values(this.dataObj).map((item)=>{
          return item.Country
        }).sort()
      },
    },
    /**
     * 起動時にfireStoreからRegionデータ読み込み
     * @returns {Promise<void>}
     */
    async fetch() {
      this.dataObj = await this.$store.dispatch('fire/initCountryNames')
    },
  }

</script>
