<template>
  <b-container>
    {{ myFamily }}
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'

export default {
  name: 'TestStoryBook',
  props: {
    myFamily: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          id: [String, Number],
          name: { type: String, required: true },
          age: Number,
          isCat: Boolean,
          vaccinationDates: {
            type: Array,
            required: false,
            validator: arrayValidator([Date, String, Number]),
          },
        }),
      }),
    },
  },
}
</script>

<style scoped></style>
