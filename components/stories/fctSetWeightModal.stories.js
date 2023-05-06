import { action } from '@storybook/addon-actions'
import fctSetWeightModal from '~/components/molecules/fctSetWeightModal'
export default {
  title: 'NFA-app/molecules/fctSetWeightModal',
  component: fctSetWeightModal,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const weight = 0
const name = 'modal01'
const menuName = 'tendon'
const items = {
  Carbohydrate: 67.9,
  En: 315,
  Fe: 1.9,
  Pr: 3.4,
  Va: '',
  Fat: 0.4,
  Food_grp: 'Starchy roots, tubers and their products',
  Name: 'Yam tuber, flour',
  Group: 'Grains, roots and tubers',
  food_grp_id: '2',
  id: '110',
}
const portionUnits = []

const showModalFlag = false

const Template = (args) => ({
  components: { fctSetWeightModal },
  setup() {
    return { args }
  },
  template:
    '<div><b-button @click="openTest">open modal</b-button>' +
    '<fctSetWeightModal v-bind="args" ' +
    '@update:showModal="openModal" ' +
    '@update:menuName="updateMenu" ' +
    '@update:weight="updateWeight" ' +
    '@update:showModal="closeModal" ' +
    '@modalOk="modalOk" ' +
    '@modalCancel="modalCancel"/></div>',
  methods: {
    openModal: action('openModal'),
    updateMenu: action('updateMenu'),
    updateWeight: action('updateWeights'),
    closeModal: action('closeModal'),
    modalOk: action('modalOk'),
    openTest() {
      this.$bvModal.show('modalInputWeight')
    },
    modalCancel() {
      this.$bvModal.hide('modalInputWeight')
      action('modalCancel')
    },
  },
})

export const DefaultFct = Template.bind({})
DefaultFct.args = {
  selectedItem: items,
  weight,
  name,
  menuName,
  showModal: showModalFlag,
  portionUnits,
}
