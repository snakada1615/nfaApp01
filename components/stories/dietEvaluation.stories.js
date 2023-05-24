import { action } from '@storybook/addon-actions'
import dietEvaluation from '~/components/organisms/dietEvaluation'
import * as recipeModalStories from '@/components/stories/recipeModal.stories'
import * as driSelectStories from '@/components/stories/driSelect.stories'

export default {
  title: 'NFA-app/organisms/dietEvaluation',
  component: dietEvaluation,
  argTypes: {},
}

const recipeCases = [
  {
    date: '2012-09-01',
    familyId: 'Bakabon',
    recipe: [
      {
        foodName: 'asa-gohan',
        Wt: 120,
        cropInfo: {
          Carbohydrate: 67.9,
          En: 315,
          Fe: 1.9,
          Fat: 0.4,
          Food_grp: 'Starchy roots, tubers and their products',
          Name: 'Yam tuber, flour',
          Pr: 3.4,
          Va: '',
          Group: 'Grains, roots and tubers',
          food_grp_id: '2',
          id: '110',
        },
      },
      {
        foodName: 'hiru-gohan',
        Wt: 54,
        cropInfo: {
          Carbohydrate: 58.9,
          En: 380,
          Fe: 3.3,
          Fat: 5.9,
          Food_grp: 'Legumes and their products',
          Name: 'Bambara groundnut, dried ',
          Pr: 20.1,
          Va: 2,
          Group: 'Legumes and nuts ',
          food_grp_id: 3,
          id: '111',
        },
      },
      {
        foodName: 'yoru-gohan',
        Wt: 219,
        cropInfo: {
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
      },
    ],
  },
]

const Template = (args) => ({
  components: { dietEvaluation },
  setup() {
    return { args }
  },
  template:
    '<dietEvaluation ' +
    '@update:recipeDate="updateRecipeDate" ' +
    '@update:recipe="updateRecipe" ' +
    'v-bind="args" />',
  methods: {
    updateRecipeDate: action('updateRecipeDate'),
    updateRecipe: action('updateRecipe'),
  },
})

export const Default = Template.bind({})

Default.args = {
  familyInfo: {
    familyId: 'Bakabon',
    nutritionDemand: 125,
    familyMember: driSelectStories.Default.args.target,
  },
  recipeCases,
  fct: recipeModalStories.Default.args.fctItems,
  dri: driSelectStories.Default.args.driItems,
  portionUnits: recipeModalStories.Default.args.portionUnits,
}
