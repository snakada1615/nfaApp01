// import { action } from '@storybook/addon-actions'
import feasibilityCheckUnit from '~/components/organisms/feasibilityCheckUnit'

export default {
  title: 'NFA-app/molecules/feasibilityCheckUnit',
  component: feasibilityCheckUnit,
  argTypes: {},
}

const Template = (args) => ({
  components: { feasibilityCheckUnit },
  setup() {
    return { args }
  },
  template: '<feasibilityCheckUnit ' + 'v-bind="args" />',
})

export const Default = Template.bind({})
