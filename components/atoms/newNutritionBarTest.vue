<template>
  <b-container>
    <div
      style="
        width: 100%;
        height: 5%;
        justify-content: center;
        align-items: center;
        display: flex;
      "
    >
      <div style="width: 45%; height: 5%; align-items: center; display: flex">
        <div
          style="
            width: 33%;
            height: 100%;
            overflow-wrap: break-word;
            line-height: 1;
            background: orange;
          "
        >
          test for overflow
        </div>
        <div style="width: 66%; height: 50%; display: flex; background: yellow">
          xxx
          <div style="width: 60%; background: red" />
        </div>
      </div>
    </div>
    {{ test }}
    <div
      style="
        width: 100vw;
        height: 2.5vw;
        justify-content: center;
        display: flex;
      "
    >
      <div style="width: 45vw; height: 2.5vw; display: flex">
        <div style="width: 15vw; height: 2.5vw; justify-content: center">
          test
        </div>
        <div
          style="width: 30vw; height: 2.5vw; display: flex; background: silver"
        >
          <div style="width: 20vw; height: 2.5vw; background: red" />
        </div>
      </div>
    </div>
    <hr />
  </b-container>
</template>

<script>
export default {
  name: 'NewNutritionBarTest',
  props: {
    test: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped></style>
