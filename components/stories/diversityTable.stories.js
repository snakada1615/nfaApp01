import diversityTable from '~/components/atoms/diversityTable'
export default {
  title: 'NFA-app/atoms/diversityTable',
  component: diversityTable,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const diversityVariable = [
  {
    name: 'Starchy roots, tubers and their products',
    status: true,
  },
  {
    name: 'Legumes and their products',
    status: false,
  },
  {
    name: 'Nuts, seeds and their products',
    status: true,
  },
]

const Template = (args) => ({
  components: { diversityTable },
  setup() {
    return { args }
  },
  template: '<diversityTable ' + 'v-bind="args" />',
})

export const DefaultDiversityTable = Template.bind({})
DefaultDiversityTable.args = {
  diversityStatus: diversityVariable,
}
