// import { action } from '@storybook/addon-actions'
import dietEvaluation from '@/components/organisms/dietEvaluation'
import recipeTableStories from '@/components/stories/recipeTable.stories'
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

export const DefaultRecipeTable = Template.bind({})
DefaultRecipeTable.args = {
  recipe: recipeTableStories.default.items,
}
