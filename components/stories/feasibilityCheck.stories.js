// import { action } from '@storybook/addon-actions'
import feasibilityCheck from '~/components/organisms/feasibilityCheck'

export default {
  title: 'NFA-app/organisms/feasibilityCheck',
  component: feasibilityCheck,
  argTypes: {},
}

const Template = (args) => ({
  components: { feasibilityCheck },
  setup() {
    return { args }
  },
  template: '<feasibilityCheck ' + 'v-bind="args" />',
})

export const Default = Template.bind({})
