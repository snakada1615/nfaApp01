import { action } from '@storybook/addon-actions'
import recipeModal from '@/components/molecules/recipeModal'
import * as fctBoxStories from '@/components/stories/fctBox.stories'
import * as recipeTableStories from '@/components/stories/recipeTable.stories'

export default {
  title: 'NFA-app/molecules/recipeModal',
  component: recipeModal,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const Template = (args) => ({
  components: { recipeModal },
  setup() {
    return { args }
  },
  template:
    '<div><b-button variant="primary" @click="openModal">open Modal</b-button>' +
    '<recipeModal @update:recipe="updateRecipe" ' +
    'v-bind="args" />' +
    '</div>',
  methods: {
    openModal() {
      this.$bvModal.show('recipeModal')
    },
    updateRecipe: action('updateRecipe'),
  },
})

export const Default = Template.bind({})
Default.args = {
  myName: 'recipeModal',
  fctItems: fctBoxStories.Default.args.items,
  recipe: recipeTableStories.Default.args.recipe,
  portionUnits: [],
  showModal: false,
}
