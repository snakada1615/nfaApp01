<template>
  <b-container>
    <b-row class="my-2">
      <!-- 作物追加用のボタン  -->
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

          <b-button variant="info" @click="showFctBox = !showFctBox">
            add crop
          </b-button>
        </b-card>
      </b-col>

      <!-- 作物多様化状態の表示 -->
      <b-col cols="12" lg="6">
        <diversity-table :diversity-status="diversityStatus" />
      </b-col>

      <!-- Nutrition barの表示 -->
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
            :rating="nutritionRating[nutritionLabel[index - 1]]"
            :max-rating-absolute="maxRating"
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

      <!-- recipe-tableの表示 -->
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
          <recipe-table :recipe="recipe" />
        </b-card>
      </b-col>
    </b-row>
    <!-- 食事入力用のダイアログ -->
    <recipe-modal
      :show-modal.sync="showFctBox"
      :portion-units="portionUnits"
      :recipe="recipe"
      :fct-items="myFct"
      my-name="fctBox01"
      @update:recipe="updateRecipe"
    />
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import recipeTable from '@/components/molecules/recipeTable'
import diversityTable from '@/components/atoms/diversityTable'
import recipeModal from '@/components/molecules/recipeModal'
import nutritionBar from '@/components/molecules/nutritionBar'
import {
  getDiversityStatus,
  getNutritionDemand,
  getNutritionSupply,
} from '@/plugins/helper'

/**
 * 食事データを入力すると、栄養ギャップおよび食の多様性を評価した結果をemit
 */
export default {
  name: 'DietEvaluation',
  components: {
    recipeTable,
    diversityTable,
    recipeModal,
    nutritionBar,
  },
  props: {
    /**
     * 対象家庭で摂取した食品名及び栄養成分の一覧
     */
    recipe: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          date: String,
          cropInfo: {
            type: Object,
            validator: objectValidator({
              Carbohydrate: Number,
              En: Number,
              Fe: Number,
              Fat: Number,
              Food_grp: String,
              Name: String,
              Pr: Number,
              Va: Number,
              Group: String,
              food_grp_id: String,
              id: String,
            }),
          },
          Wt: Number,
          foodName: String,
        }),
      }),
    },
    /**
     * ターゲットグループの構成：v-modelで使用
     *   [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]
     */
    targetMember: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          id: String,
          count: Number,
        }),
      }),
    },
    /**
     * 食品成分表:食品名及び栄養成分の一覧を含む配列
     */
    myFct: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          Carbohydrate: Number,
          En: Number,
          Fe: Number,
          Fat: Number,
          Food_grp: String,
          Name: String,
          Pr: Number,
          Va: Number,
          Group: String,
          food_grp_id: String,
          id: String,
        }),
      }),
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
    myDri: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          id: String,
          En: Number,
          Pr: Number,
          Va: Number,
          max_vol: Number,
          Name: String,
        }),
      }),
    },
    /**
     * portion換算用の変換表
     */
    portionUnits: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          id: String,
          FCT_id: String,
          count_method: String,
          unit_weight: Number,
        }),
      }),
    },
  },
  data() {
    return {
      /**
       * fctTableModal表示用のフラグ
       */
      showFctBox: false,
      /**
       * nutritionBar用のproperty：栄養素表示用のlabel
       */
      nutritionLabel: ['En', 'Pr', 'Va', 'Fe'],
      /**
       * nutritionBar用のproperty：ratingの最大値
       */
      maxRating: 10,
    }
  },
  computed: {
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
     * recipeに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      const vm = this
      return getDiversityStatus(vm.recipe, vm.foodGroup)
    },
    nutritionDemand() {
      const vm = this
      return getNutritionDemand(vm.targetMember, vm.myDri)
    },
    nutritionSupply() {
      const vm = this
      return getNutritionSupply(vm.recipe, 1)
    },
    /**
     * nutritionBar用のレーティング
     * @returns {*} 栄養素ごとの充足率
     */
    nutritionRating() {
      const vm = this
      return {
        En: vm.nutritionDemand.En
          ? Math.round((100 * vm.nutritionSupply.En) / vm.nutritionDemand.En) /
            10
          : 0,
        Pr: vm.nutritionDemand.Pr
          ? Math.round((100 * vm.nutritionSupply.Pr) / vm.nutritionDemand.Pr) /
            10
          : 0,
        Va: vm.nutritionDemand.Va
          ? Math.round((100 * vm.nutritionSupply.Va) / vm.nutritionDemand.Va) /
            10
          : 0,
        Fe: vm.nutritionDemand.Fe
          ? Math.round((100 * vm.nutritionSupply.Fe) / vm.nutritionDemand.Fe) /
            10
          : 0,
      }
    },
  },
  methods: {
    /**
     * recipeの更新を親に伝達
     * @param val
     */
    updateRecipe(val) {
      this.$emit('update:recipe', val)
    },
  },
}
</script>

<style scoped></style>
