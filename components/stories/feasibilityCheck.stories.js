// import { action } from '@storybook/addon-actions'
import feasibilityCheck from '~/components/organisms/feasibilityCheck'
import * as qaToolStories from '@/components/stories/qaTool.stories'

export default {
  title: 'NFA-app/organisms/feasibilityCheck',
  component: feasibilityCheck,
  argTypes: {},
}

const myFeasibilityCases = [
  {
    familyId: 'baka01',
    caseId: 'baka01_1_115',
    month: '1',
    note: '',
    selectedCrop: {
      Carbohydrate: 67.9,
      En: 315,
      Fe: 1.9,
      Fat: 0.4,
      Food_grp: 'Starchy roots, tubers and their products',
      Name: 'Orange peel',
      Pr: 3.4,
      Va: 0,
      Group: 'Grains, roots and tubers',
      food_grp_id: '2',
      id: '115',
    },
    prodTarget: {
      Wt: 123,
      Wt365: 43432,
      share: 93,
    },
    answerList: [
      { categoryId: 1, questionId: 0, optionId: 2, score: 2 },
      { categoryId: 1, questionId: 1, optionId: 0, score: 4 },
      { categoryId: 1, questionId: 2, optionId: 1, score: 3 },
    ],
  },
  {
    familyId: 'baka01',
    caseId: 'baka01_2_110',
    month: '2',
    note: '',
    selectedCrop: {
      Carbohydrate: 67.9,
      En: 315,
      Fe: 1.9,
      Fat: 0.4,
      Food_grp: 'Starchy roots, tubers and their products',
      Name: 'Yam tuber, flour',
      Pr: 3.4,
      Va: 0,
      Group: 'Grains, roots and tubers',
      food_grp_id: '2',
      id: '110',
    },
    prodTarget: {
      Wt: 123,
      Wt365: 43432,
      share: 93,
    },
    answerList: [
      { categoryId: 1, questionId: 0, optionId: 2, score: 2 },
      { categoryId: 1, questionId: 1, optionId: 0, score: 4 },
      { categoryId: 1, questionId: 2, optionId: 1, score: 3 },
    ],
  },
  {
    familyId: 'baka01',
    caseId: 'baka01_2_213',
    month: '2',
    note: '',
    selectedCrop: {
      Carbohydrate: 67.9,
      En: 315,
      Fe: 1.9,
      Fat: 0.4,
      Food_grp: 'Starchy roots, tubers and their products',
      Name: 'hot dog',
      Pr: 3.4,
      Va: 0,
      Group: 'Grains, roots and tubers',
      food_grp_id: '2',
      id: '213',
    },
    prodTarget: {
      Wt: 123,
      Wt365: 43432,
      share: 93,
    },
    answerList: [
      { categoryId: 1, questionId: 0, optionId: 2, score: 2 },
      { categoryId: 1, questionId: 1, optionId: 0, score: 4 },
      { categoryId: 1, questionId: 2, optionId: 1, score: 3 },
    ],
  },
]

const Template = (args) => ({
  components: { feasibilityCheck },
  setup() {
    return { args }
  },
  template: '<feasibilityCheck ' + 'v-bind="args" />',
})

export const Default = Template.bind({})

Default.args = {
  selectedMonth: '2',
  selectedNutrient: 'Pr',
  feasibilityCases: myFeasibilityCases,
  qaList: {
    qaTitle: 'diet feasibilit question',
    totalScore: 10,
    categoryList: qaToolStories.Default.args.qaList,
  },
}
