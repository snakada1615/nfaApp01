<template>
  <b-container>
    <!-- 家族名表示 -->
    <div>
      family name:<span class="text-danger font-weight-bold">{{
        familyInfo.familyId
      }}</span>
    </div>

    <!-- 日付選択 -->
    <b-input-group prepend="select survey date" size="sm" class="my-1">
      <b-form-select v-model="selectedDate" :options="dateList" />
      <template #append>
        <b-button v-b-modal.dateModal variant="info">new survey</b-button>
      </template>
    </b-input-group>
    {{ selectedDate }}

    <diet-evaluation-unit
      :recipe="recipeFiltered"
      :recipe-date.sync="selectedDate"
      :target-member="familyInfo.familyMember"
      :my-fct="fct"
      :my-dri="dri"
      :portion-units="portionUnits"
      @update:recipe="updateRecipe"
      @update:recipeDate="updateRecipeDate"
    />

    <!-- recipeデータの新規作成 -->
    <b-modal
      id="dateModal"
      title="Select date for new 24hr recall"
      @ok="createNewRecipe(newlyCreatedDate)"
    >
      <b-form-datepicker v-model="newlyCreatedDate" />
    </b-modal>
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import dietEvaluationUnit from '@/components/organisms/dietEvaluationUnit'

/**
 * dietEvaluationUnitの拡張版
 * * 複数のrecipeを切り替えながら編集。
 * * recipeは日付が"unique ID"になっており、日付で切り替える
 * * 入力値はrecipeセット、家族情報、戻り値は更新したrecipeと日付
 */
export default {
  name: 'DietEvaluation',
  components: { dietEvaluationUnit },
  component: {
    dietEvaluationUnit,
  },
  props: {
    /**
     * 対象家族の情報
     */
    familyInfo: {
      type: Object,
      required: true,
      validator: objectValidator({
        familyId: String,
        nutritionDemand: Number,
        familyMember: {
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
      }),
    },
    /**
     * 対象家庭で摂取した食品名及び栄養成分の一覧
     */
    recipeCases: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        variable: objectValidator({
          date: Date,
          familyId: String,
          recipe: {
            type: Array,
            required: true,
            validator: arrayValidator({
              type: Object,
              validator: objectValidator({
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
        }),
      }),
    },
    /**
     * 食品成分表:食品名及び栄養成分の一覧を含む配列
     */
    fct: {
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
    dri: {
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
      selectedDate: '',
      newlyCreatedDate: '',
    }
  },
  computed: {
    recipeFiltered: {
      get() {
        const res = this.recipeCases.find(
          (item) =>
            item.familyId === this.familyInfo.familyId &&
            item.date === this.selectedDate
        )
        return res ? res.recipe : []
      },
    },
    dateList: {
      get() {
        return this.recipeCases.map((item) => {
          return item.date
        })
      },
    },
  },
  methods: {
    updateRecipe(val) {
      this.$emit('update:recipe', val)
    },
    updateRecipeDate(val) {
      this.$emit('update:recipeDate', val)
    },
    createNewRecipe(val) {
      const vm = this
      if (val) {
        if (
          window.confirm('do you want to conduct 24hr recall for ' + val + '?')
        ) {
          this.selectedDate = val
          const res = JSON.parse(JSON.stringify(vm.recipeCases))
          res.push({
            date: val,
            familyId: vm.familyInfo.familyId,
            recipe: [],
          })
          this.updateRecipe(res)
        }
      }
    },
  },
}
</script>

<style scoped></style>
