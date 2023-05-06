import { action } from '@storybook/addon-actions'
import fctBoxModal from '~/components/molecules/fctBoxModal'
import * as fctBoxStories from '@/components/stories/fctBox.stories'
import * as recipeTableStories from '@/components/stories/recipeTable.stories'

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
    '<fctBoxModal @update:recipe="updateRecipe" ' +
    'v-bind="args" />' +
    '</div>',
  methods: {
    openModal() {
      this.$bvModal.show('fctBoxModal')
    },
    updateRecipe: action('updateRecipe'),
  },
})

export const Default = Template.bind({})
Default.args = {
  myName: 'fctBoxModal',
  fctItems: fctBoxStories.Default.args.items,
  recipe: recipeTableStories.Default.args.recipe,
  portionUnits: [],
  showModal: false,
}
