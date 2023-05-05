<template>
  <b-container>
    <fct-box :items="myItem" />
  </b-container>
</template>

<script>
import fctBox from '@/components/molecules/fctBox'

export default {
  name: 'MyTest01',
  components: {
    fctBox,
  },
  data() {
    return {
      myItem: [
        {
          Carbohydrate: 67.9,
          En: 315,
          Fe: 1.9,
          Fat: 0.4,
          Food_grp: 'Starchy roots, tubers and their products',
          Name: 'Yam tuber, flour',
          Pr: 3.4,
          Va: 0,
          Group: 'Grains, roots and tubers',
          food_grp_id: '2',
          id: '110',
        },
        {
          Carbohydrate: 58.9,
          En: 380,
          Fe: 3.3,
          Fat: 5.9,
          Food_grp: 'Legumes and their products',
          Name: 'Bambara groundnut, dried ',
          Pr: 20.1,
          Va: 2,
          Group: 'Legumes and nuts ',
          food_grp_id: '3',
          id: '111',
        },
        {
          Carbohydrate: 20.3,
          En: 562,
          Fe: 3.7,
          Fat: 43.2,
          Food_grp: 'Nuts, seeds and their products',
          Name: 'Groundnut, rose',
          Pr: 20.4,
          Va: 0,
          Group: 'Legumes and nuts ',
          food_grp_id: '6',
          id: '273',
        },
      ],
    }
  },
}
</script>
