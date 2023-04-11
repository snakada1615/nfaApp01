import { action } from '@storybook/addon-actions'
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

const Template = (args) => ({
  components: { testStoryBook },
  setup() {
    return { args }
  },
  template:
    '<div><b-button @click="halo">yes</b-button><testStoryBook v-bind="args" /></div>',
  methods: {
    onClick: action('update　family　member'),
    halo() {
      this.$bvModal.show('modalTest1')
    },
  },
})

export const DefaultTestStoryBook = Template.bind({})
DefaultTestStoryBook.args = {}
