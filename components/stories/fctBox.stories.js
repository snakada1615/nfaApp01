import { action } from '@storybook/addon-actions'
import fctBox from '~/components/molecules/fctBox'
export default {
  title: 'NFA-app/molecules/fctBox',
  component: fctBox,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    items: {
      control: 'object',
      defaultValue: [],
    },
    // 個別にコンポーネントのemitイベントを定義する
    fctClick: {
      description: 'テーブルの行をクリックした際にその行の情報をemit',
    },
    fctDblClick: {
      description: 'テーブルの行をダブルクリックした際にその行の情報をemit',
    },
    fctClickPlus: {
      description: 'テーブルの行の＋をクリックした際にその行の情報をemit',
    },
  },
}

const items = [
  {
    Carbohydrate: '67.9',
    En: '315',
    Fe: '1.9',
    Fat: '0.4',
    Food_grp: 'Starchy roots, tubers and their products',
    Name: 'Yam tuber, flour',
    Pr: '3.4',
    Va: '',
    Group: 'Grains, roots and tubers',
    food_grp_id: '2',
    id: '110',
  },
  {
    Carbohydrate: '58.9',
    En: '380',
    Fe: '3.3',
    Fat: '5.9',
    Food_grp: 'Legumes and their products',
    Name: 'Bambara groundnut, dried ',
    Pr: '20.1',
    Va: '2',
    Group: 'Legumes and nuts ',
    food_grp_id: '3',
    id: '111',
  },
  {
    Carbohydrate: '20.3',
    En: '562',
    Fe: '3.7',
    Fat: '43.2',
    Food_grp: 'Nuts, seeds and their products',
    Name: 'Groundnut, rose',
    Pr: '20.4',
    Va: '0',
    Group: 'Legumes and nuts ',
    food_grp_id: '6',
    id: '273',
  },
]

const Template = (args) => ({
  components: { fctBox },
  setup() {
    return { args }
  },
  template:
    '<fctBox ' +
    'v-bind="args" ' +
    '@fctClick="fctClick" ' +
    '@fctDblClick="fctDblClick" ' +
    '@fctClickPlus="fctClickPlus"/>',
  methods: {
    fctClick: action('fctClick'),
    fctDblClick: action('fctDblClick'),
    fctClickPlus: action('fctClickPlus'),
  },
})

export const DefaultFctBox = Template.bind({})
DefaultFctBox.args = {
  items: [...items],
}
