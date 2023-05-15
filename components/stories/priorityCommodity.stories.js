// import { action } from '@storybook/addon-actions'
import priorityCommodity from '~/components/molecules/priorityCommodity'
import * as fctBoxModalStories from '~/components/stories/fctBoxModal.stories'

export default {
  title: 'NFA-app/molecules/priorityCommodity',
  component: priorityCommodity,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const month = 3
const keyNutrient = 'En'
const calendar = []
const cropList = []

const Template = (args) => ({
  components: { priorityCommodity },
  setup() {
    return { args }
  },
  template: '<priorityCommodity ' + 'v-bind="args" />',
})

export const Default = Template.bind({
  selectedMonth: month,
  selectedNutrient: keyNutrient,
  fct: fctBoxModalStories.Default.args.fctItems,
  cropCalendar: calendar,
  cropList,
})
