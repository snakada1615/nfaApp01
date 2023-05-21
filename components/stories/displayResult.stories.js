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
  singleScoreList: [
    { title: 'Protein', singleScore: 8 },
    { title: 'Vit-A', singleScore: 4 },
    { title: 'Energy', singleScore: 6 },
    { title: 'Iron', singleScore: 2 },
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
