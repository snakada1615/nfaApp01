<template>
  <b-container>
    <b-row class="my-2">
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2"
        >
          <template #header>
            <div class="font-weight-bold">Add diet information</div>
          </template>

          <b-button variant="info" @click="showFct = !showFct">
            add crop
          </b-button>
        </b-card>
      </b-col>

      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2"
        >
          <template #header>
            <div class="font-weight-bold">Dietary diversity</div>
          </template>
          <div
            v-for="(grp, index) in foodGroup"
            :key="index"
            class="border my-1 px-1"
            :class="{
              'bg-warning': !diversityStatus[pageIdComputed][index][grp],
              'bg-success': diversityStatus[pageIdComputed][index][grp],
            }"
          >
            {{ grp }}
          </div>
        </b-card>
      </b-col>

      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2"
        >
          <template #header>
            <div class="font-weight-bold">Key Nutrients Sufficiency</div>
          </template>
          <b-row>
            <b-col cols="2" class="d-flex justify-content-center">
              Target
            </b-col>
            <b-col cols="2" class="d-flex justify-content-center">
              Supply
            </b-col>
            <b-col class="d-flex justify-content-start pl-5">
              sufficiency rate
            </b-col>
          </b-row>
          <nutrition-bar
            v-for="index in 4"
            :key="index"
            :col-width-first="3"
            :colwidth-second="2"
            :colwidth-third="5"
            :colwidth-fourth="2"
            :label="nutritionLabel[index - 1]"
            :max-rating="maxRating"
            :rating="rating[pageIdComputed][nutritionLabel[index - 1]]"
            :max-rating-absolute="
              nutritionSupplyWatcher[pageIdComputed][nutritionLabel[index - 1]]
            "
          />
          <b-row>
            <b-col>
              <div class="small">
                * the amount of protein and fe from staple is excluded from
                total
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2"
        >
          <template #header>
            <div class="font-weight-bold">Record of Diet</div>
          </template>
          <recipe-table
            :items="currentMenu[pageIdComputed]"
            @itemDeleted="notifiRecipeEdit"
            @rowClick="notifiRecipeEdit"
          />
        </b-card>
      </b-col>
    </b-row>

    <fct-box-modal
      :show-modal.sync="showFct"
      :items="myFct"
      :menu-cases.sync="currentMenu[pageIdComputed]"
      :portion-units="myPortion"
      @update:menuCases="updateSupply($event, pageIdComputed)"
    />
  </b-container>
</template>

<script>
import objectValidator from 'vue-props-validation'
import {
  getNutritionSupplyList,
  validateMyFamily,
  getNutritionDemandList,
  updatePfc,
  getPfcScale,
  getDiversityStatus,
} from '@/plugins/helper'
import recipeTable from '@/components/molecules/recipeTable'
import nutritionBar from '@/components/molecules/nutritionBar'
import fctBoxModal from '@/components/molecules/fctBoxModal'
import diversityTable from '@/components/atoms/diversityTable'

/**
 * @desc 3つのコンポーネントを組み合わせて食事評価
 * 2. foodBoxModal
 *    利用する品目の摂取量決定→栄養供給量の決定
 * 3. recipeTable
 *    選択された品目一覧を示す
 * 4. nutritionBar
 *    栄養素の充足状況をバーチャートで示す
 *
 */
export default {
  components: {
    recipeTable,
    nutritionBar,
    fctBoxModal,
    diversityTable,
  },
  props: {
    myFamily: {
      type: Object,
      required: true,
      validator(value) {
        return validateMyFamily(value)
      },
    },
    myDri: {
      type: Array,
      required: true,
    },
    myFct: {
      type: Array,
      required: true,
    },
    myPortion: {
      type: Array,
      required: true,
    },
    /**
     * 複数インスタンスを作成する場合のindex
     */
    pageId: {
      type: Number,
      required: true,
    },
    /**
     * 作成するページ数
     */
    maxPage: {
      type: Number,
      required: true,
    },
    /**
     * 共通のDRIを使うか、ケース毎に異なるDRIを設定するか決めるフラグ
     */
    useCommonTarget: {
      type: Boolean,
      default: true,
    },
    /**
     * 最初のページを表示しないためのフラグ
     */
    disabledOption: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * 冒頭のCase infoを非表示にする（familyCaseの場合）
     */
    hideCaseInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pfcBalanceCurrent: [],
      currentMenu: [],
      dataset: [
        {
          text: 'Protein',
          x: 20,
          y: 20,
          bgColor: 'lightGreen',
          textColor: 'black',
          fontSize: '10px',
        },
        {
          text: 'Fat',
          x: 20,
          y: 20,
          bgColor: 'hotPink',
          textColor: 'black',
          fontSize: '10px',
        },
        {
          text: 'Carbo.',
          x: 20,
          y: 20,
          bgColor: 'lightSkyBlue',
          textColor: 'black',
          fontSize: '10px',
        },
      ],
      /**
       * 使用する全変数のobject
       * myFamilyから読み込んでこのページで利用。更新された時にemitを返す
       */
      myFamilyWatcher: {},
      /**
       * menuテーブルから計算される栄養供給量の合計値
       * menuCases[].menuから読み込んでこのページで利用。参照専用
       */
      nutritionSupplyWatcher: [],
      /**
       * menuテーブルから計算される栄養供給目標の合計値
       * nutritionDemandから読み込んでこのページで利用。参照専用
       */
      nutritionDemandWatcher: {},
      /**
       * nutritionBar用のレーティング
       * nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算
       */
      rating: [],
      /**
       * nutritionBar用のproperty：栄養素表示用のlabel
       */
      nutritionLabel: ['En', 'Pr', 'Va', 'Fe'],
      /**
       * nutritionBar用のproperty：ratingの最大値
       */
      maxRating: 10,
      /**
       * ターゲットの1グループあたり設定人数の最大値
       */
      maxPopulation: 10000,
      /**
       * nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定
       */
      driSwitch: true,
      /**
       * 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty
       */
      items_modal: [],
      /**
       * 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty
       */
      value_model: 0,
      /**
       * 当該作物がどのメニュに含まれるかを示す変数
       */
      menuName_modal: '',
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
      /**
       * modal表示用のフラグ
       */
      showModal: false,
      /**
       * 各ページの捕捉情報
       */
      pageMemo: [],
      /**
       * PFCバランスの推奨値
       */
      pfcStandard: {
        labels: ['protein', 'fat', 'carbo.'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['lightGreen', 'hotPink', 'lightSkyBlue'],
            data: [35, 10, 55],
          },
        ],
      },
      /**
       * currentとrecommendを比較した場合のエネルギー量の充足度
       * rating[].Enの値を1.5と0.5で足切りしたもの
       */
      pfcScale: [],
    }
  },
  computed: {
    /**
     * 現在のページ番号
     */
    pageIdComputed: {
      get() {
        return this.pageId
      },
      set(newVal) {
        if (this.pageId !== newVal) {
          this.$emit('update:pageId', newVal)
        }
      },
    },
    /**
     * ページ一覧：リストからページ選択するためのarray option
     * @returns {*[]}
     */
    pageOptions() {
      const res = []
      for (let i = 0; i < this.maxPage; i++) {
        res.push({
          value: i,
          text: this.pageMemo[i] ? this.pageMemo[i] : '------------',
          disabled: this.disabledOption.includes(i),
        })
      }
      return res
    },
    /**
     * FCTからfood Groupを抽出
     * @returns {*}
     */
    foodGroup() {
      return this.myFct.reduce((accumulator, dat) => {
        if (!accumulator.includes(dat.Group)) {
          accumulator.push(dat.Group)
        }
        return accumulator
      }, [])
    },
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      const vm = this
      return getDiversityStatus(vm.myFamilyWatcher.menuCases, vm.foodGroup)
    },
    /**
     * familyNameの選択状態
     * @returns {boolean}
     */
    stateFamilyNameSelection: {
      get() {
        return this.pageMemo[this.pageIdComputed] !== ''
      },
    },
  },
  watch: {
    /**
     * myFamily Property(オブジェクト)の変更を検知してコンポーネントに反映させる
     */
    myFamily: {
      deep: true,
      handler(newVal) {
        const vm = this
        vm.myFamilyWatcher = JSON.parse(JSON.stringify(newVal))
        let memberSetList = []
        if (vm.useCommonTarget) {
          const memberSet = JSON.parse(
            JSON.stringify(vm.myFamilyWatcher.member)
          )
          memberSetList = [...Array(vm.maxPage)].map(() => memberSet)
        } else {
          memberSetList = vm.myFamilyWatcher.menuCases.map((item) => {
            return item.target
          })
        }
        /*
                function memberSetList2(singleTarget){
                  if (singleTarget) {
                    const memberSet = JSON.parse(JSON.stringify(vm.myFamilyWatcher.member))
                    return [...Array(vm.maxPage)].map(() => memberSet)
                  } else {
                    return vm.myFamilyWatcher.map((item)=>{
                      return item.target
                    })
                  }
                }
        */
        vm.nutritionDemandWatcher = JSON.parse(
          JSON.stringify(getNutritionDemandList(memberSetList, vm.myDri))
        )
        vm.nutritionSupplyWatcher = JSON.parse(
          JSON.stringify(
            getNutritionSupplyList(vm.myFamily.menuCases, vm.maxPage, 1)
          )
        )
        vm.rating = JSON.parse(
          JSON.stringify(
            vm.ratingGetter(
              vm.nutritionSupplyWatcher,
              vm.nutritionDemandWatcher
            )
          )
        )
        vm.pfcScale = JSON.parse(JSON.stringify(getPfcScale(vm.rating)))
        vm.pageMemo = vm.myFamily.menuCases.map((item2) => {
          return item2.note
        })
        vm.currentMenu = JSON.parse(
          JSON.stringify(
            vm.myFamilyWatcher.menuCases.map((item) => {
              return item.menu
            })
          )
        )
        vm.pfcBalanceCurrent = JSON.parse(
          JSON.stringify(updatePfc(vm.nutritionSupplyWatcher))
        )
      },
    },
  },
  /**
   * 初期値の代入
   */
  created() {
    const vm = this
    vm.myFamilyWatcher = JSON.parse(JSON.stringify(vm.myFamily))

    let memberSetList = []
    if (vm.useCommonTarget) {
      const memberSet = JSON.parse(JSON.stringify(vm.myFamilyWatcher.member))
      memberSetList = [...Array(vm.maxPage)].map(() => memberSet)
    } else {
      memberSetList = vm.myFamilyWatcher.menuCases.map((item) => {
        return item.target
      })
    }

    vm.nutritionDemandWatcher = JSON.parse(
      JSON.stringify(getNutritionDemandList(memberSetList, vm.myDri))
    )
    vm.nutritionSupplyWatcher = JSON.parse(
      JSON.stringify(
        getNutritionSupplyList(vm.myFamily.menuCases, vm.maxPage, 1)
      )
    )
    vm.rating = JSON.parse(
      JSON.stringify(
        vm.ratingGetter(vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)
      )
    )
    vm.pfcScale = JSON.parse(JSON.stringify(getPfcScale(vm.rating)))
    vm.pageMemo = vm.myFamily.menuCases.map((item2) => {
      return item2.note
    })
    vm.currentMenu = JSON.parse(
      JSON.stringify(
        vm.myFamilyWatcher.menuCases.map((item) => {
          return item.menu
        })
      )
    )
    vm.pfcBalanceCurrent = JSON.parse(
      JSON.stringify(updatePfc(vm.nutritionSupplyWatcher))
    )
  },
  methods: {
    /**
     * ページメモの更新：
     * @param newVal
     * @param index
     */
    updatePageMemo(newVal, index) {
      // 作業用のmyAppコピー作成
      const dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      // 更新されたmenuを入れ替える
      dat.menuCases[index].note = newVal
      // 更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
    ratingGetter(supplyCases, demandCases) {
      const res = []
      for (let i = 0; i < this.maxPage; i++) {
        const supply = supplyCases[i]
        const demand = demandCases[i]
        /*
                const supply = this.nutritionSupplyWatcher[i]
                const demand = this.nutritionDemandWatcher[i]
        */
        res.push({
          En: demand.En ? Math.round((100 * supply.En) / demand.En) / 10 : 0,
          Pr: demand.Pr ? Math.round((100 * supply.Pr) / demand.Pr) / 10 : 0,
          Va: demand.Va ? Math.round((100 * supply.Va) / demand.Va) / 10 : 0,
          Fe: demand.Fe ? Math.round((100 * supply.Fe) / demand.Fe) / 10 : 0,
        })
      }
      return res
    },
    /** ユーザーによりmenuCasesが変更された際に、myApp全体を更新してemit
     * @param val
     * @param index
     */
    updateSupply(val, index) {
      // 作業用のmyAppコピー作成
      const dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      // 更新されたmenuを入れ替える
      dat.menuCases[index].menu = val
      // 更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * ユーザーによりtergetが変更された際に、栄養素必要量合計を再計算してemit
     * @param val
     * @param index
     */
    updateDemand(val, index) {
      const vm = this
      // targetが固定の場合は何もせず終了
      if (vm.useCommonTarget) {
        return
      }
      // 作業用のmyAppコピー作成
      const dat = JSON.parse(JSON.stringify(vm.myFamilyWatcher))
      // 更新されたtargetを入れ替える
      dat.menuCases[index].target = JSON.parse(JSON.stringify(val))
      // 更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * ユーザーによりrecipeTableがクリックされた際に、行の内容を組み込んでfoodModalを開く
     * @param val
     */
    onRecepiClicked(val) {
      this.items_modal.length = 0
      this.items_modal.push({
        id: val.id,
        Name: val.Name,
        Group: val.Group,
        En: val.En,
        Pr: val.Pr,
        Va: val.Va,
        Fe: val.Fe,
      })
      this.menuName_modal = val.menuName
      this.value_model = val.Wt
      this.showModal = true
    },
    /**
     * ユーザーによりfctTableがクリックされた時に行の内容を組み込んでfoodModalを開く
     * @param val
     */
    onFctClick(val) {
      this.items_modal.length = 0
      this.items_modal.push({
        id: val.id,
        Name: val.Name,
        Group: val.Group,
        En: val.En,
        Pr: val.Pr,
        Va: val.Va,
        Fe: val.Fe,
        Carbohydrate: val.Carbohydrate,
        Fat: val.Fat,
      })
      this.value_model = 0
      this.showModal = true
    },
    /**
     * menuが変更・追加された際に、栄養素供給量合計を再計算してemit
     * 新規なら追加、変更なら更新
     * @param val 更新されたmenu
     */
    addSupply(val) {
      const vm = this
      // menuを更新する
      let existing = false
      let newMenu = []
      newMenu = vm.myFamilyWatcher.menuCases[vm.pageIdComputed].menu.map(
        (item) => {
          if (item.id === val.id && item.menuName === val.menuName) {
            existing = true
            return JSON.parse(JSON.stringify(val))
          } else {
            return item
          }
        }
      )
      if (!existing) {
        newMenu.push(val)
      }
      // 作業用のmyAppコピー作成
      const dat = JSON.parse(JSON.stringify(vm.myFamilyWatcher))
      // 更新されたmenuを入れ替える
      dat.menuCases[vm.pageIdComputed].menu = newMenu
      // 更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * menuが削除された際に、栄養素供給量合計を再計算してemit
     * @param val 更新されたmenu
     */
    deleteSupply(val) {
      // 作業用のmyAppコピー作成
      const dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      // 更新されたmenuを入れ替える
      dat.menuCases[this.pageIdComputed].menu = val
      // 更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    notifiRecipeEdit() {
      alert('you can edit diet record by clicking [add crop] button')
    },
  },
}
</script>
