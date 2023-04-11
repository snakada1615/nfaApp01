import { action } from '@storybook/addon-actions'
import nutritionBar from '~/components/molecules/nutritionBar'
export default {
  title: 'NFA-app/molecules/nutritionBar',
  component: nutritionBar,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const rating = 3
const label = 'Protein'

const Template = (args) => ({
  components: { nutritionBar },
  setup() {
    return { args }
  },
  template: '<nutritionBar ' + 'v-bind="args" />',
})

export const DefaultNutritionBar = Template.bind({})
DefaultNutritionBar.args = {
  rating,
  label,
}
