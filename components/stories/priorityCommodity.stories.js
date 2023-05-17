// import { action } from '@storybook/addon-actions'
import priorityCommodity from '~/components/molecules/priorityCommodity'
import * as fctBoxModalStories from '~/components/stories/fctBoxModal.stories'

export default {
  title: 'NFA-app/molecules/priorityCommodity',
  component: priorityCommodity,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const month = '3'
const keyNutrient = 'Pr'
const calendar = [
  {
    1: '0',
    2: '1',
    3: '0',
    4: '2',
    5: '0',
    6: '1',
    7: '0',
    8: '1',
    9: '0',
    10: '1',
    11: '0',
    12: '0',
    FCT_id: '110',
    Group: 'Grains, roots and tubers',
    Name: 'Yam tuber, flour',
    id: '0',
  },
  {
    1: '0',
    2: '1',
    3: '1',
    4: '0',
    5: '0',
    6: '2',
    7: '1',
    8: '0',
    9: '0',
    10: '0',
    11: '0',
    12: '0',
    FCT_id: '111',
    Group: 'Legumes and nuts ',
    Name: 'Bambara groundnut, dried ',
    id: '1',
  },
  {
    1: '1',
    2: '1',
    3: '1',
    4: '0',
    5: '0',
    6: '0',
    7: '0',
    8: '2',
    9: '2',
    10: '0',
    11: '1',
    12: '0',
    FCT_id: '273',
    Group: 'Legumes and nuts ',
    Name: 'Yam tuber, flour',
    id: '2',
  },
  {
    1: '1',
    2: '0',
    3: '1',
    4: '2',
    5: '1',
    6: '0',
    7: '2',
    8: '0',
    9: '0',
    10: '0',
    11: '0',
    12: '0',
    FCT_id: '85',
    Group: 'Vitamin A rich fruits and Vegetable',
    Name: 'Sweet potato, deep yellow',
    id: '3',
  },
  {
    1: '0',
    2: '1',
    3: '1',
    4: '0',
    5: '2',
    6: '2',
    7: '1',
    8: '0',
    9: '0',
    10: '0',
    11: '0',
    12: '0',
    FCT_id: '155',
    Group: 'Other fruits and vegetables',
    Name: 'Cabbage',
    id: '4',
  },
]
const cropList = []
const feasibilityCases = [
  {
    target: [{ id: 'sss', Number: 4 }],
    selectedCrop: {
      Carbohydrate: 67.9,
      En: 315,
      Fe: 1.9,
      Fat: 0.4,
      Food_grp: 'Starchy roots, tubers and their products',
      Name: 'Yam tuber, flour',
      Pr: 3.4,
      Va: 0,
      Group: 'Grains, roots and tubers',
      food_grp_id: '2',
      id: '110',
    },
    month: '3',
  },
]

const Template = (args) => ({
  components: { priorityCommodity },
  setup() {
    return { args }
  },
  template: '<priorityCommodity ' + 'v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  selectedMonth: month,
  selectedNutrient: keyNutrient,
  fct: fctBoxModalStories.Default.args.items,
  cropCalendar: calendar,
  cropList,
  feasibilityCases,
}