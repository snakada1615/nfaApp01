<template>
  <b-container>
    halo
    <recipe-table items="items" />
  </b-container>
</template>

<script>
import recipeTable from '@/components/molecules/recipeTable'

export default {
  name: 'DietEvaluation',
  components: {
    recipeTable,
  },
  props: {
    /**
     * 食品名及び栄養成分の一覧を含む配列
     */
    recipe: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped></style>
