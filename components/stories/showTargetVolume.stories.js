import { action } from '@storybook/addon-actions'
import showTargetVolume from '@/components/atoms/showTargetVolume'

export default {
  title: 'NFA-app/atoms/showTargetVolume',
  component: showTargetVolume,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const targetInfo = {
  targetCommodity: 'Onigiri',
  targetNutrition: 'Protein',
  nutritionGap: 150,
  prodTarget: {
    Wt: 75,
    Wt365: 23450,
    share: 50,
  },
}

const Template = (args) => ({
  components: { showTargetVolume },
  setup() {
    return { args }
  },
  template:
    '<show-target-volume ' +
    'v-bind="args" ' +
    '@update:targetInfo="update" /><script>',
  methods: {
    update: action('update:targetInfo'),
  },
})

export const Default = Template.bind({})
Default.args = {
  targetInfo,
}
