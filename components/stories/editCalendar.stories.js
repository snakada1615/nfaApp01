import { action } from '@storybook/addon-actions'
import editCalendar from '~/components/organisms/editCalendar'

export default {
  title: 'NFA-app/molecules/editCalendar',
  component: editCalendar,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const items = [
  {
    1: 1,
    2: 0,
    3: 2,
    4: 0,
    5: 0,
    6: 0,
    7: 2,
    8: 2,
    9: 0,
    10: 0,
    11: 1,
    12: 0,
    FCT_id: '85',
    Group: 'Vitamin A rich fruits and Vegetable',
    cropName: 'Sweet potato, deep yellow',
    id: '3',
  },
  {
    1: 0,
    2: 1,
    3: 2,
    4: 0,
    5: 0,
    6: 1,
    7: 1,
    8: 2,
    9: 0,
    10: 0,
    11: 1,
    12: 0,
    FCT_id: '155',
    Group: 'Vegetables and their products',
    cropName: 'Cabbage',
    id: '1',
  },
  {
    1: 0,
    2: 1,
    3: 2,
    4: 0,
    5: 0,
    6: 1,
    7: 1,
    8: 2,
    9: 0,
    10: 0,
    11: 1,
    12: 0,
    FCT_id: '85',
    Group: 'Starchy roots, tubers and their products',
    cropName: 'Sweet potato, deep yellow',
    id: '2',
  },
]

const Template = (args) => ({
  components: { editCalendar },
  setup() {
    return { args }
  },
  template:
    '<edit-calendar ' +
    'v-bind="args" ' +
    '@update:currentCalendar="updateCalendar" ' +
    '/>',

  methods: {
    updateCalendar: action('updateCalendar'),
  },
})

export const Default = Template.bind({})
Default.args = {
  calendarContent: items,
}
