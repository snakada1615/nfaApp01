import { action } from '@storybook/addon-actions'
import fctBoxModal from '~/components/molecules/FctBoxModal'
import * as fctBoxStories from '@/components/stories/fctBox.stories'

export default {
  title: 'NFA-app/molecules/fctBoxModal',
  component: fctBoxModal,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const Template = (args) => ({
  components: { fctBoxModal },
  setup() {
    return { args }
  },
  template:
    '<div><b-button variant="primary" @click="openModal">open Modal</b-button>' +
    '<fctBoxModal @modalOk="updateSelection" ' +
    'v-bind="args" />' +
    '</div>',
  methods: {
    openModal() {
      this.$bvModal.show('fctBoxModal')
    },
    updateSelection: action('fctBoxModal'),
  },
})

export const Default = Template.bind({})
Default.args = {
  myName: 'fctBoxModal',
  myModalHeader: 'select food item',
  items: fctBoxStories.Default.args.items,
  showModal: false,
}
