// import { action } from '@storybook/addon-actions'
import displayResult from '@/components/molecules/displayResult'

export default {
  title: 'NFA-app/molecules/displayResult',
  component: displayResult,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const result = {
  cropName: 'apple',
  totalScore: 35,
  maxScore: 60,
  categoryScore: [
    { title: 'Protein', score: 8 },
    { title: 'Vit-A', score: 4 },
    { title: 'Energy', score: 6 },
    { title: 'Iron', score: 2 },
  ],
}

const Template = (args) => ({
  components: { displayResult },
  setup() {
    return { args }
  },
  template: '<display-result ' + 'v-bind="args" />',
  methods: {},
})

export const Default = Template.bind({})
Default.args = {
  feasibilityResult: result,
}
