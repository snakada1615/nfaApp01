<template>
  <b-modal
    :id="myName"
    v-model="showModalComputed"
    :title="myModalHeader"
    static
    hide-header
    @ok="clickOk"
    @cancel="clickCancel"
  >
    <fct-box
      :items="items"
      head-row-variant="success"
      table-variant="light"
      @fctClick="onFctClick"
      @fctClickPlus="onFctClickPlus"
      @fctDblClick="onFctDblClick"
    ></fct-box>
  </b-modal>
</template>

<script>
import FctBox from '~/components/molecules/fctBox'

/**
 * fctBoxをModal化したもの
 * 1. propsでFCTテーブルを受け取り表示
 * 2. 特定行をclickすると品目情報をemit
 */
export default {
  components: {
    FctBox,
  },
  props: {
    /**
     * モーダル表示用のID
     */
    myName: {
      type: String,
      required: true,
    },
    /**
     * モーダルのタイトル
     */
    myModalHeader: {
      type: String,
      required: true,
    },
    /**
     * FCTテーブル用のデータ
     */
    items: {
      type: Array,
      required: true,
    },
    /**
     * モーダルの表示用トリガー
     */
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      /**
       * 選択された行のデータを代入する変数
       */
      selectedItem: '',
    }
  },
  computed: {
    /**
     * モーダル表示用のフラグ
     */
    showModalComputed: {
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      },
    },
  },
  methods: {
    /**
     * 行をクリックされた場合にその内容をemitする
     * @param rec
     */
    onFctClick(rec) {
      this.selectedItem = rec
      this.$emit('fctClick', rec)
    },
    /**
     * 行+をクリックされた場合にその内容をemitする
     * @param rec
     */
    onFctClickPlus(rec) {
      this.selectedItem = rec
      this.$emit('fctClickPlus', rec)
    },
    /**
     * 行をダブルクリックされた場合にその内容をemitしてmodalを閉じる
     * @param rec
     */
    onFctDblClick(rec) {
      this.selectedItem = rec
      this.$emit('fctDblClick', rec)
      this.clickOk()
      this.$emit('update:showModal', false)
    },
    /**
     * 選択されたfood itemをemitする
     */
    clickOk() {
      this.$emit('modalOk', this.selectedItem)
    },
    /**
     * 操作内容を破棄して戻る
     */
    clickCancel() {
      console.log('Cancel')
    },
  },
}
</script>
