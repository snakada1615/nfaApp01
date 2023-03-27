import RegionSelect from '~/components/atoms/regionSelect'
export default {
  title: 'NFA-App/atoms/regionSelect',
  component: RegionSelect,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    regionList: {
      description: 'regionの一覧',
      control: 'object',
      defaultValue: [],
    },
    key1: {
      description: '選択された地域1',
      control: 'string',
      defaultValue: '',
    },
    key2: {
      description: '選択された地域2',
      control: 'string',
      defaultValue: '',
    },
    key3: {
      description: '選択された地域3',
      control: 'string',
      defaultValue: '',
    },
    label1: {
      description: 'region1のラベル',
      control: 'string',
      defaultValue: 'Region',
    },
    label2: {
      description: 'region2のラベル',
      control: 'string',
      defaultValue: 'Zone',
    },
    label3: {
      description: 'region3のラベル',
      control: 'string',
      defaultValue: 'Woreda',
    },
    // 個別にコンポーネントのemitイベントを定義する
    selected: {
      description: 'emitイベント',
      action: 'item selected',
    },
  },
}

export const DefaultRegionSelect = (args, { argTypes }) => ({
  components: { RegionSelect },
  props: Object.keys(argTypes),
  template: `<RegionSelect v-bind="$props" />`,
})
