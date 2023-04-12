import testStoryBook from '~/components/atoms/testStoryBook'

export default {
  title: 'NFA-app/atoms/testStoryBook',
  component: testStoryBook,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    // 個別にコンポーネントのemitイベントを定義する
  },
}

// const myFamily = ['mari', 'yuto', 'moe']
const myFamily = 'nakaniwa'

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
