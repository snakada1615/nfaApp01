// import { action } from '@storybook/addon-actions'
import dietEvaluation from '@/components/organisms/dietEvaluation'
import * as recipeTableStories from '@/components/stories/recipeTable.stories'
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
  template: '<diet-evaluation ' + 'v-bind="args" />',
})

export const DefaultDietEvaluation = Template.bind({})
DefaultDietEvaluation.args = {
  recipe: recipeTableStories.DefaultRecipeTable.args.items,
}
