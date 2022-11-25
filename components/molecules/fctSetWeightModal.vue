<template>
  <b-container>
    <!--  ここからデータ入力用modal  -->
    <b-modal
      id="modalInputWeight"
      v-model="showModalComputed"
      hide-header
      hide-footer
      no-close-on-esc
    >
      <!--   タイトル   -->
      <b-row class="px-0 mx-0 my-1">
        <b-col>
          <span class="font-weight-bold">Add </span>
          <span class="text-danger font-weight-bold">
            {{ selectedItem.Name }}
          </span>
        </b-col>
      </b-row>

      <!--   Add/Cancelボタン   -->
      <b-row align-h="end" class="my-2">
        <b-col class="d-flex justify-content-end">
          <b-button
            variant="primary"
            class="mx-1"
            size="sm"
            :disabled="!stateFoodName || !stateFoodVolume"
            @click="clickOk(foodVolume)"
          >
            Add
          </b-button>

          <b-button class="mx-0" size="sm" @click="clickCancel">
            Cancel
          </b-button>
        </b-col>
      </b-row>

      <!--   食事名と食材ボリュームの記録   -->
      <b-card
        header-bg-variant="success"
        border-variant="success"
        bg-variant="light"
        class="my-2"
      >
        <!-- 食事名の設定 -->
        <span class="font-weight-bold text-success">set diet name</span>
        <b-input-group size="sm" class="mx-0">
          <template #prepend>
            <b-button size="sm" variant="info"> diet name </b-button>
          </template>
          <b-form-input
            id="inputFoodName"
            v-model="foodName"
            :state="stateFoodName"
            aria-describedby="input-live-help input-live-feedback"
          />
          <b-form-invalid-feedback id="input-live-feedback">
            <small>Enter at least 4 letters, or select from below</small>
          </b-form-invalid-feedback>
        </b-input-group>

        <!-- 典型的な食事名の一覧 -->
        <b-row>
          <b-col>
            <b-button
              v-for="dietName in typicalMenu"
              :key="dietName"
              pill
              size="sm"
              class="px-1 py-0 my-0 mx-1"
              variant="outline-success"
              @click="foodName = dietName"
            >
              <span class="small">{{ dietName }}</span>
            </b-button>
          </b-col>
        </b-row>
      </b-card>

      <!-- portion数の設定 -->
      <b-card
        header-bg-variant="success"
        border-variant="success"
        bg-variant="light"
        class="my-2"
      >
        <span class="font-weight-bold text-success">set volume</span>
        <b-input-group size="sm" class="mx-0">
          <template #prepend>
            <b-button size="sm" variant="info"> portion count </b-button>
          </template>
          <b-form-input
            id="inputVolume"
            v-model="portionCount"
            type="number"
            :state="stateFoodVolume"
          />
        </b-input-group>

        <!-- 合計重量の表示 -->
        <b-row class="mt-2">
          <b-col>
            total weight:
            <span class="text-danger font-weight-bold">
              {{ foodVolume }}
            </span>
            gram

            <!-- portionの選択 -->
            <b-table
              bordered
              small
              selectable
              select-mode="single"
              head-row-variant="success"
              :items="portionList"
              :fields="fieldSetting"
              @row-selected="onPortionSelected"
            />
          </b-col>
        </b-row>
      </b-card>

      <!-- 食材の写真表示 -->
      <b-card
        header-bg-variant="success"
        border-variant="success"
        bg-variant="light"
        class="mt-0 pb-2"
      >
        <b-row>
          <b-col>
            <b-card class="border-0 py-2 px-2" align="center">
              <b-img-lazy
                :src="portionImg"
                fluid
                alt="no-image"
                onerror="this.src='/img/crops/no_image.png'"
              />
            </b-card>
          </b-col>
        </b-row>
      </b-card>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  /**
   * foodModal
   *     fctTableから行の値を受け取ってmodalに表示する
   *     ユーザーが入力したweight値をOkクリック時にemit
   */
  props: {
    /**
     * modalに表示するデータarray of object、
     *     構造は以下
     *     {
     *     En: "315",
     *     Fe: "1.9",
     *     Pr: "3.4",
     *     Va: "",
     *     Name: "Yam tuber, flour",
     *     Group: "Grains, roots and tubers",
     *     id:"5221"
     *     }
     */
    selectedItem: {
      type: Object,
      required: true,
    },
    /**
     * portion換算用の変換表
     */
    portionUnits: {
      type: Array,
      required: true,
    },
    /**
     * itemに対応したweightの値
     */
    weight: {
      type: Number,
      required: true,
    },
    /**
     * 当該作物がどのメニューの材料に含まれているのか記載
     */
    menuName: {
      type: String,
      required: true,
    },
    typicalMenu: {
      type: Array,
      default: () => [
        '1st meal',
        '2nd meal',
        '3rd meal',
        '4th meal',
        '1st snack',
        '2nd snack',
        '3rd snack',
      ],
    },
    /**
     * modalのID
     */
    name: {
      type: String,
      default: 'fctWeightModal',
    },
    /**
     * modalのタイトル
     */
    headerText: {
      type: String,
      default: '',
    },
    /**
     * 入力するWeightの最大値を指定
     */
    maxWeight: {
      type: Number,
      default: 1000,
    },
    /**
     * 入力値の型を指定
     */
    myType: {
      type: String,
      default: 'Number',
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
       * portionの画像リンク
       */
      portionImg: '',
      selected: '',
      fieldSetting: [
        {
          key: 'FCT_id',
          sortable: false,
          tdClass: 'd-none',
          thClass: 'd-none',
        },
        { key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'count_method', sortable: false },
        { key: 'unit_weight', sortable: false },
      ],
      foodName: '',
      /**
       * 食材の重さの入力値:portion数
       */
      portionCount: 0,
      /**
       * 食材の重さの入力値:portionの単位量
       */
      portionSize: 0,
    }
  },
  computed: {
    /**
     * ダイアログで食材の量が入力されているかどうかのフラグ
     * @returns {boolean}
     */
    stateFoodVolume() {
      return this.portionCount > 0 && this.portionSize > 0
    },
    /**
     * ダイアログで食事の名称が入力されているかどうかのフラグ
     * @returns {boolean}
     */
    stateFoodName() {
      return this.foodName.length > 3
    },
    /**
     * 食材の重さの入力値
     */
    foodVolume() {
      return this.portionCount * this.portionSize
    },
    /**
     * 重量計算用のportion一覧表
     * @returns {[{count_method: string, FCT_id: string, id: string,
     *     unit_weight: number},{count_method: string, FCT_id: string,
     *     id: string, unit_weight: number},{count_method: string,
     *     FCT_id: string, id: string, unit_weight: number}]|*[]}
     */
    portionList() {
      const vm = this
      if (vm.selectedItem === '') {
        return [
          {
            FCT_id: '0',
            id: '999',
            count_method: 'ton',
            unit_weight: 1000000,
          },
          {
            FCT_id: '0',
            id: '998',
            count_method: 'Kg',
            unit_weight: 1000,
          },
          {
            FCT_id: '0',
            id: '997',
            count_method: 'gram',
            unit_weight: 1,
          },
        ]
      }
      const res = this.portionUnits.filter((dat) => {
        return dat.FCT_id === vm.selectedItem.id
      })
      res.push(
        {
          FCT_id: '0',
          id: '999',
          count_method: 'ton',
          unit_weight: 1000000,
        },
        {
          FCT_id: '0',
          id: '998',
          count_method: 'Kg',
          unit_weight: 1000,
        },
        {
          FCT_id: '0',
          id: '997',
          count_method: 'gram',
          unit_weight: 1,
        }
      )
      return res
    },
    /**
     * modal表示設定
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
  watch: {
    // modalが表示される度にcount_methodをgramにセットする
    showModal(val) {
      if (val) {
        this.selected =
          this.portionList[this.portionList.length - 1].count_method
      }
    },
  },
  created() {
    this.foodName = this.menuName
    this.portionCount = this.weight
    this.portionSize = 1
  },
  methods: {
    onPortionSelected(item) {
      if (item.length) {
        this.portionImg = item[0].photoLink
          ? item[0].photoLink[0]
          : '/img/crops/no_image.png'
        this.portionSize = item[0].unit_weight
      }
    },
    // ...
    setDigit(item, unitKey) {
      let res = ''
      const units = [
        { 1: ' g', 2: ' kg', 3: ' t' },
        { 1: ' µg', 2: ' mg', 3: ' g' },
        { 1: ' mg', 2: ' g', 3: ' kt' },
        { 1: ' KC', 2: ' MC', 3: ' GC' },
      ]
      switch (true) {
        case item < 1000:
          res = String(item) + units[unitKey]['1']
          break
        case item >= 1000 && item < 1000000:
          res = String(Math.round(item / 1000)) + units[unitKey]['2']
          break
        case item >= 1000000:
          res = String(Math.round(item / 1000000)) + units[unitKey]['3']
          break
        default:
          console.error('parameter not valid:setDigit')
          res = ''
          break
      }
      return res
    },
    /**
     * テーブル内の要素（items）と入力されたWtを一つのObjectに合成して返す
     */
    clickOk() {
      const result = {}
      result.cropInfo = this.selectedItem
      result.Wt = this.foodVolume
      result.foodName = this.foodName
      this.$emit('update:menuName', this.foodName)
      this.$emit('update:weight', this.foodVolume)
      this.$emit('update:showModal', false)

      this.portionImg = ''
      this.selected = ''
      this.foodName = ''
      this.portionCount = 0
      this.portionSize = 0

      this.$emit('modalOk', result)
    },
    clickCancel() {
      // data初期化
      this.portionImg = ''
      this.selected = ''
      this.foodName = ''
      this.portionCount = 0
      this.portionSize = 0

      this.$emit('update:showModal', false)
      this.$emit('modalCancel')
    },
  },
}
</script>
