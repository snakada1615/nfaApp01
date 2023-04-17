import testStoryBook from '~/components/atoms/testStoryBook'

export default {
  title: 'NFA-app/atoms/testStoryBook',
  component: testStoryBook,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    // 個別にコンポーネントのemitイベントを定義する
    // test
  },
}

// const myFamily = ['mari', 'yuto', 'moe']
const myFamily = [
  {
    id: 8,
    name: 'nakaniwa',
    age: 'hisotries',
    isCat: false,
    vaccinationDates: ['hotel', 7, 'hop'],
  },
  {
    id: 32,
    name: 'hong',
    age: 5,
    isCat: true,
    vaccinationDates: [22, 17, 9],
  },
]

const Template = (args) => ({
  components: { testStoryBook },
  setup() {
    return { args }
  },
  template: '<testStoryBook v-bind="args" />',
})

export const DefaultTestStoryBook = Template.bind({})
DefaultTestStoryBook.args = {
  myFamily,
}
