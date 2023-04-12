<template>
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
      v-for="(grp, index) in diversityStatus"
      :key="index"
      class="border my-1 px-1"
      :class="{
        'bg-warning': !grp.status,
        'bg-success': grp.status,
      }"
    >
      {{ grp.name }}
    </div>
  </b-card>
</template>

<script>
/**
 * - 食の多様性を食べた食品群（緑）、食べていない食品群（黄）で色分けして表示
 */
export default {
  name: 'DiversityTable',
  props: {
    /**
     * 食の多様性を示す配列
     */
    diversityStatus: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped></style>
