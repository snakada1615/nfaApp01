import { action } from '@storybook/addon-actions'
import dietEvaluation from '@/components/organisms/dietEvaluation'
import * as recipeTableStories from '@/components/stories/recipeTable.stories'
import * as recipeModalStories from '~/components/stories/recipeModal.stories'
import * as driSelectStories from '@/components/stories/driSelect.stories'
export default {
  title: 'NFA-app/organisms/dietEvaluation',
  component: dietEvaluation,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const Template = (args) => ({
  components: { dietEvaluation },
  setup() {
    return { args }
  },
  template:
    '<diet-evaluation ' +
    'v-bind="args" @update:recipe="updateRecipe" @updateNutritionGap="updateNutritionGap"/>',
  methods: {
    updateRecipe: action('update'),
    updateNutritionGap: action('updateNutritionGap'),
  },
})

export const Default = Template.bind({})
Default.args = {
  recipe: recipeTableStories.Default.args.recipe,
  targetMember: driSelectStories.Default.args.target,
  myFct: recipeModalStories.Default.args.fctItems,
  myDri: driSelectStories.Default.args.driItems,
  portionUnits: recipeModalStories.Default.args.portionUnits,
}
