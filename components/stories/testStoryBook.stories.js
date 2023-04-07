import { action } from '@storybook/addon-actions'
import testStoryBook from '~/components/atoms/testStoryBook'

export default {
  title: 'NFA-app/atoms/testStoryBook',
  component: testStoryBook,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    // 個別にコンポーネントのemitイベントを定義する
    onClick: {},
  },
}

export const actionsData = {
  onClick: action('pin-task'),
}

const Template = (args) => ({
  components: { testStoryBook },
  setup() {
    return { args }
  },
  template: '<testStoryBook @clickedEmit="onClick" v-bind="args" />',
  methods: { onClick: action('click-b') },
})

export const DefaultTestStoryBook = Template.bind({})
