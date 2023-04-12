<template>
  <b-container>
    <b-modal
      :id="myName"
      v-model="showModalComputed"
      :title="myModalHeader"
      static
      @ok="clickOk"
      @cancel="clickCancel"
    >
      <b-card class="mb-2" border-variant="success">
        <!--    ここからFCTテーブル      -->
        <b-row class="mb-0">
          <div class="font-weight-bold ml-3 text-primary">
            food composition table
          </div>
        </b-row>
        <b-row class="my-0">
          <div class="small ml-3 text-muted">
            (1) select food item from the list below
          </div>
        </b-row>
        <b-row class="my-0">
          <fct-box
            :items="fctItems"
            head-row-variant="success"
            table-variant="light"
            class="mb-0"
            @fctClick="onFctClick"
          />
        </b-row>
      </b-card>

      <b-card class="mb-2" border-variant="success">
        <!--   ここから選択されたfood itemの表示     -->
        <b-row>
          <div class="font-weight-bold ml-3 text-primary">
            add new ingredients
          </div>
          <b-button
            class="px-0 py-0 mx-0 my-0"
            variant="light"
            :disabled="!stateSelectedItem"
            @click="showInputModal = !showInputModal"
          >
            <b-badge variant="danger" class="px-1 py-1"> + </b-badge>
          </b-button>
        </b-row>

        <b-row>
          <div class="small ml-3 text-muted">
            (2) add food item by clicking +
          </div>
        </b-row>

        <b-table
          :items="selectedItemArray"
          :fields="fieldsSelected"
          head-row-variant="success"
          small
          outlined
        >
          <!-- A custom formatted header cell for field 'name' -->
          <template #head(menuName)>
            <span>Menu</span>
          </template>

          <!-- A custom formatted header cell for field 'name' -->
          <template #head(Name)>
            <span>ingredients</span>
          </template>

          <!-- A custom formatted cell for field 'name' -->
          <template #cell(Name)="data">
            <span class="text-info" style="font-size: small">{{
              data.value
            }}</span>
            <span
              v-if="!data.value"
              class="text-danger"
              style="font-size: small"
              >--- no data ---</span
            >
          </template>

          <!-- A custom formatted cell for field 'menuName' -->
          <template #cell(menuName)="data">
            <span class="text-info pointer" style="font-size: small">{{
              data.value
            }}</span>
            <span
              v-if="!data.value"
              class="text-danger"
              style="font-size: small"
              >-----</span
            >
          </template>

          <!-- A custom formatted cell for field 'En' -->
          <template #cell(En)="data">
            <span class="text-info" style="font-size: small">{{
              setDigit2(Number(data.value), 3)
            }}</span>
          </template>

          <!-- A custom formatted cell for field 'Pr' -->
          <template #cell(Pr)="data">
            <span class="text-info" style="font-size: small">{{
              setDigit2(Number(data.value), 0)
            }}</span>
          </template>

          <!-- A custom formatted cell for field 'Va' -->
          <template #cell(Va)="data">
            <span class="text-info" style="font-size: small">{{
              setDigit2(Number(data.value), 1)
            }}</span>
          </template>

          <!-- A custom formatted cell for field 'Fe' -->
          <template #cell(Fe)="data">
            <span class="text-info" style="font-size: small">{{
              setDigit2(Number(data.value), 2)
            }}</span>
          </template>

          <!-- A custom formatted cell for field 'Wt' -->
          <template #cell(Wt)="data">
            <span class="text-info pointer" style="font-size: small">{{
              setDigit2(Number(data.value), 0)
            }}</span>
          </template>
        </b-table>
      </b-card>

      <!--  ここから食事記録の表示    -->
      <b-card class="mb-2" border-variant="success">
        <span class="font-weight-bold text-primary">diet record</span>
        <recipe-table
          :items="menuCases"
          head-row-variant="success"
          @itemDeleted="deleteSupply"
          @rowClick="onRecipeClicked"
        />
      </b-card>
    </b-modal>

    <!--  ここからデータ入力用modal  -->
    <fct-set-weight-modal
      :selected-item="selectedItem"
      :portion-units="portionUnits"
      :weight="portionCount"
      menu-name=""
      name="fctSetWeightModal"
      :show-modal="showInputModal"
      @modalOk="addItem"
    />
  </b-container>
</template>

<script>
import fctBox from '@/components/molecules/fctBox'
import recipeTable from '@/components/molecules/recipeTable'
import FctSetWeightModal from '@/components/molecules/fctSetWeightModal'
import { setDigit } from '@/plugins/helper'

/**
 * - fctBoxをModal化したもの
 * 1. propsでFCTテーブルを受け取り表示
 * 2. 特定行をclickすると品目情報をfoodModalに転送して開く
 * 3. foodModalで重量を決定し、fctBoxに戻す
 * 4. Okクリックで選択された品目と重量をemit
 */
export default {
  components: {
    FctSetWeightModal,
    fctBox,
    recipeTable,
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
      default: 'Dietary survey',
    },
    /**
     * FCTテーブル用のデータ
     */
    fctItems: {
      type: Array,
      required: true,
    },
    /**
     * menuテーブル用のデータ
     *   {
     *     foodName: 'hiru-gohan',
     *     Wt: 54,
     *     cropInfo: {
     *       Carbohydrate: '58.9',
     *       En: '380',
     *       Fe: '3.3',
     *       Fat: '5.9',
     *       Food_grp: 'Legumes and their products',
     *       Name: 'Bambara groundnut, dried ',
     *       Pr: '20.1',
     *       Va: '2',
     *       Group: 'Legumes and nuts ',
     *       food_grp_id: '3',
     *       id: '111',
     *     },
     *  },
     */
    menuCases: {
      type: Array,
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
     * モーダルの表示用トリガー
     */
    showModal: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      /**
       * 画像表示用property
       */
      imgProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        width: 200,
        height: 200,
        class: 'my-5',
      },
      /**
       * portion表示用設定
       */
      fields1: [
        { key: 'id', tdClass: 'd-none', thClass: 'd-none' },
        { key: 'FCT_id', tdClass: 'd-none', thClass: 'd-none' },
        { key: 'name', tdClass: 'd-none', thClass: 'd-none' },
        { key: 'count_method', label: 'Portion' },
        { key: 'unit_weight' },
      ],
      /**
       * portionの画像リンク
       */
      portionImg: '',
      /**
       * 食材の重さの入力値:portion数
       */
      portionCount: 0,
      /**
       * 食材の重さの入力値:portionの単位量
       */
      portionSize: 0,
      /**
       * 食事のメニュー名
       */
      foodName: '',
      /**
       * 入力用のModalを開くためのフラグ
       */
      showInputModal: false,
      /**
       * 選択された行のデータを代入する変数
       */
      selectedItem: '',
      /**
       * 選択された作物(selectedItem)の表示用
       */
      fieldsSelected: [
        { key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        {
          key: 'menuName',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        { key: 'Name', sortable: true },
        {
          key: 'En',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Pr',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Va',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Fe',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Wt',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
      ],
      /**
       * 代表的なメニュー一覧
       */
      typicalMenu: [
        '1st meal',
        '2nd meal',
        '3rd meal',
        '4th meal',
        '1st snack',
        '2nd snack',
        '3rd snack',
      ],
      /**
       * portionUnitの初期値
       */
      defaultPortions: [
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
      ],
    }
  },
  computed: {
    /**
     * 食材の重さの入力値
     */
    foodVolume() {
      return this.portionCount * this.portionSize
    },
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
     * FCTで食材が選択されているかどうかのフラグ
     * @returns {boolean}
     */
    stateSelectedItem() {
      return this.selectedItem !== ''
    },
    /**
     * 選択されたFCT行を配列に変換
     * @returns {string[]}
     */
    selectedItemArray() {
      return [this.selectedItem]
    },
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
    setDigit2(x, y) {
      return setDigit(x, y)
    },
    onPortionSelected(item) {
      if (item.length) {
        this.portionImg = item[0].photoLink
          ? item[0].photoLink[0]
          : '/img/crops/no_image.png'
        this.portionSize = item[0].unit_weight
      }
    },
    /**
     * 行をクリックされた場合にその内容をselectedItemにコピー
     * @param rec
     */
    onFctClick(rec) {
      this.selectedItem = JSON.parse(JSON.stringify(rec))
    },
    /**
     * 最終結果(menuCases)をemit
     */
    clickOk() {
      const vm = this
      vm.$emit('modalOk', vm.menuCases)
      // データをクリアして入力用ダイアログを閉じる
      vm.selectedItem = ''
      vm.portionCount = 0
      vm.portionSize = 1
      vm.foodName = ''
      vm.showInputModal = false
    },
    /**
     * 捜査内容を破棄して戻る
     */
    clickCancel() {
      // データをクリアして入力用ダイアログを閉じる
      const vm = this
      vm.selectedItem = ''
      vm.portionCount = 0
      vm.portionSize = 1
      vm.foodName = ''
      vm.showInputModal = false
    },
    /**
     * 入力ダイアログの内容をselectedItemに追記して、menuCasesの配列に追加後、更新のためemit
     */
    addItem(result) {
      const vm = this

      let res = []
      let addNew = true
      res = vm.menuCases.map((item) => {
        // もし既存データとidおよび食事名が一致した場合には追加ではなく既存の値を変更
        if (
          item.cropInfo.id === result.cropInfo.id &&
          item.foodName === result.menuName
        ) {
          item.Wt = Number(result.Wt)
          addNew = false
        }
        return item
      })

      // もし既存のデータとマッチしていなければ新規追加
      console.log('addNew:' + addNew)
      if (addNew) {
        res.push(result)
      }

      // 更新した値をemit
      this.$emit('update:menuCases', res)

      // データをクリアして入力用ダイアログを閉じる
      vm.selectedItem = ''
      vm.portionCount = 0
      vm.portionSize = 1
      vm.foodName = ''
      vm.showInputModal = false
    },
    /**
     * recipeTableの削除ボタンをクリックした際に
     *     削除後の値をemitしてmenuCasesを更新
     * @param val
     */
    deleteSupply(val) {
      // 更新した値をemit
      this.$emit('update:menuCases', val)
    },
    /**
     * recipeTableの行をクリックした場合に、その行の内容を
     *     selectedItem, foodName, foodVolumeにコピーした上で
     *     編集用ダイアログを開く
     * @param val
     */
    onRecipeClicked(val) {
      this.selectedItem = JSON.parse(JSON.stringify(val))
      this.foodName = this.selectedItem.menuName
      this.portionSize = 1
      this.portionCount = this.selectedItem.Wt
      this.showInputModal = true
    },
  },
}
</script>
