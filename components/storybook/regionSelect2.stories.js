import RegionSelect from '~/components/atoms/regionSelect'
export default {
  title: 'NFA-App/atoms/regionSelect',
  component: RegionSelect,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { RegionSelect },
  template: `<RegionSelect v-bind="$props" />'、
})
