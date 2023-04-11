import { action } from '@storybook/addon-actions'
import driSelect from '~/components/molecules/driSelect'
export default {
  title: 'NFA-app/molecules/driSelect',
  component: driSelect,
  target: {},
  driItems: {},
  max: {},
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    // 個別にコンポーネントのemitイベントを定義する
    'update:target': {
      description: '対象人数の変更を親コンポーネントに通知',
    },
    changeNutritionValue: {
      description: '必要栄養素量の変更を親コンポーネントに通知',
    },
  },
}

const myParam = {
  driItems: [
    {
      En: '1088.0',
      Fe: '5.8',
      max_vol: '900',
      Name: 'child 6-23 month',
      Pr: '11.65',
      Va: '400.0',
      id: 0,
    },
    {
      En: '3066.0',
      Fe: '44.4',
      max_vol: '2500',
      Name: 'lactating',
      Pr: '61.0',
      Va: '850.0',
      id: 1,
    },
    {
      En: '2913.0',
      Fe: '24.9',
      max_vol: '2600',
      Name: 'adolescent all',
      Pr: '52.65',
      Va: '600.0',
      id: 2,
    },
  ],
  target: [{ id: 0, count: 1 }],
  max: 500,
}

const Template = (args) => ({
  components: { driSelect },
  setup() {
    return { args }
  },
  template:
    '<driSelect ' +
    'v-bind="args" ' +
    '@update:target="updateNewFamily" ' +
    '@changeNutritionValue="changeNutritionValue"' +
    '/>',
  methods: {
    updateNewFamily: action('update　family　member'),
    changeNutritionValue: action('update　nutrition target'),
  },
})

export const DefaultDriSelect = Template.bind({})
DefaultDriSelect.args = {
  driItems: [...myParam.driItems],
  target: myParam.target,
  max: myParam.max,
}
