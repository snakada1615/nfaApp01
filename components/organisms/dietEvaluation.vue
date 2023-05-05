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

          <b-button variant="info"> add crop </b-button>
        </b-card>
      </b-col>

      <!-- 作物多様化状態の表示 -->
      <b-col cols="12" lg="6">
        <diversity-table diversity-status="diversityStatus" />
      </b-col>

      <!-- recepi-tableの表示 -->
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
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import recipeTable from '@/components/molecules/recipeTable'
import diversityTable from '@/components/atoms/diversityTable'

export default {
  name: 'DietEvaluation',
  components: {
    recipeTable,
    diversityTable,
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
          cropInfo: {},
          Wt: Number,
          foodName: String,
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
  },
}
</script>

<style scoped></style>
