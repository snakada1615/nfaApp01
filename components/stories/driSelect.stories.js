import { action } from '@storybook/addon-actions'
import driSelect from '~/components/molecules/driSelect'
export default {
  title: 'NFA-app/molecules/driSelect',
  component: driSelect,
  argTypes: {},
}

const myParam = {
  driItems: [
    {
      En: 1088.0,
      Fe: 5.8,
      max_vol: 900,
      Name: 'child 6-23 month',
      Pr: 11.65,
      Va: 400.0,
      id: '0',
    },
    {
      En: 3066.0,
      Fe: 44.4,
      max_vol: 2500,
      Name: 'lactating',
      Pr: 61.0,
      Va: 850.0,
      id: '1',
    },
    {
      En: 2913.0,
      Fe: 24.9,
      max_vol: 2600,
      Name: 'adolescent all',
      Pr: 52.65,
      Va: 600.0,
      id: '2',
    },
  ],
  target: [{ id: '2', count: 2 }],
  max: 500,
}

const Template = (args) => ({
  components: { driSelect },
  setup() {
    return { args }
  },
  template:
    '<driSelect ' +
    '@update:target="updateNewFamily" ' +
    'v-bind="args" ' +
    '/>',
  methods: {
    updateNewFamily: action('update family member'),
  },
})

export const Default = Template.bind({})
Default.args = {
  driItems: [...myParam.driItems],
  target: myParam.target,
  max: myParam.max,
}
