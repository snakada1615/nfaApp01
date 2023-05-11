// import { action } from '@storybook/addon-actions'
import fileAccess from '@/components/atoms/fileAccess'
export default {
  title: 'NFA-app/organisms/fileAccess',
  component: fileAccess,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const Template = (args) => ({
  components: { fileAccess },
  setup() {
    return { args }
  },
  template:
    '<div><b-button variant="primary" @click="openModal">open Modal</b-button>' +
    '<file-access ' +
    'v-bind="args" />',
  methods: {
    openModal() {
      this.$bvModal.show('modalSave')
    },
  },
})

export const Default = Template.bind({})
Default.args = {
  docId: 'testMan',
  collection: 'nfaSharedData',
  showModal: false,
}

export const withList = Template.bind({})
withList.args = {
  docId: 'testManWithList',
  collection: 'nfaSharedData',
  showModal: false,
  docList: ['doc1', 'doc2', 'doc3', 'myDOc4'],
}
