// import { action } from '@storybook/addon-actions'
import newNutritionBarTest from '@/components/atoms/newNutritionBarTest'

export default {
  title: 'NFA-app/atoms/newNutritionBarTest',
  component: newNutritionBarTest,
  argTypes: {},
}

const Template = (args) => ({
  components: { newNutritionBarTest },
  setup() {
    return { args }
  },
  template: '<new-nutrition-bar-test ' + 'v-bind="args" />',
  methods: {},
})

export const Default = Template.bind({})
Default.args = {
  test: 'myTEst usenifj',
}
