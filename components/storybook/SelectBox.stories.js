import SelectBox from '~/components/SelectBox'
export default {
  title: 'Design System/Atoms/SelectBox',
  component: SelectBox,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {
    id: {
      description: 'セレクトボックスのID',
      control: 'text',
      defaultValue: 'chinryouMin',
    },
    value: {
      description: 'セレクトボックスの値',
      control: 'text',
      defaultValue: '0',
    },
    options: {
      description: 'セレクトボックスの選択肢',
      control: {
        type: 'object',
      },
      defaultValue: [
        { code: '0', name: '下限なし' },
        { code: '1', name: '上限なし' },
        { code: '2', name: '３万円' },
      ],
    },
    // 個別にコンポーネントのemitイベントを定義する
    selected: {
      description: 'emitイベント',
      action: 'item selected',
    },
  },
}

export const DefaultSelectBox = (args, { argTypes }) => ({
  components: { SelectBox },
  props: Object.keys(argTypes),
  template: `<SelectBox @selected="selected" v-bind="$props" />`,
})

export const SelectBoxWithSlot = (args, { argTypes }) => ({
  components: { SelectBox },
  props: Object.keys(argTypes),
  template: `<div><SelectBox @selected="selected" v-bind="$props">〜</SelectBox><SelectBox @selected="selected" v-bind="$props"/></div>`,
})
