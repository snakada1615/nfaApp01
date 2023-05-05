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
    '<fctBoxModal @update:menuCases="updateMenuCase" ' +
    'v-bind="args" />' +
    '</div>',
  methods: {
    openModal() {
      this.$bvModal.show('fctBoxModal')
    },
    updateMenuCase: action('updateMenu'),
  },
})

export const DefaultFctBoxModal = Template.bind({})
DefaultFctBoxModal.args = {
  myName: 'fctBoxModal',
  fctItems: fctBoxStories.DefaultFctBox.args.items,
  recipe: recipeTableStories.DefaultRecipeTable.args.recipe,
  portionUnits: {},
  showModal: false,
}
