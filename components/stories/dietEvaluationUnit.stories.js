import { action } from '@storybook/addon-actions'
import dietEvaluationUnit from '@/components/organisms/dietEvaluationUnit.vue'
import * as recipeTableStories from '@/components/stories/recipeTable.stories'
import * as recipeModalStories from '~/components/stories/recipeModal.stories'
import * as driSelectStories from '@/components/stories/driSelect.stories'
export default {
  title: 'NFA-app/organisms/dietEvaluationUnit',
  component: dietEvaluationUnit,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const Template = (args) => ({
  components: { dietEvaluationUnit },
  setup() {
    return { args }
  },
  template:
    '<diet-evaluation-unit ' +
    'v-bind="args" @update:recipe="updateRecipe" ' +
    '@updateNutritionGap="updateNutritionGap" ' +
    '@update:recipeDate="updateDate"' +
    '/>',
  methods: {
    updateRecipe: action('update'),
    updateDate: action('updateDate'),
    updateNutritionGap: action('updateNutritionGap'),
  },
})

export const Default = Template.bind({})
Default.args = {
  recipe: recipeTableStories.Default.args.recipe,
  recipeDate: '2012-09-01',
  targetMember: driSelectStories.Default.args.target,
  myFct: recipeModalStories.Default.args.fctItems,
  myDri: driSelectStories.Default.args.driItems,
  portionUnits: recipeModalStories.Default.args.portionUnits,
}
