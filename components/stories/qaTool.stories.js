import { action } from '@storybook/addon-actions'
import qaTool from '@/components/atoms/qaTool'

export default {
  title: 'NFA-app/atoms/qaTool',
  component: qaTool,
  // 下記のparametersの設定はコンポーネントにあるすべてのemitイベントをロギングすることができます
  // parameters: { actions: { argTypesRegex: '.*' } },
  argTypes: {},
}

const qaList = {
  qaTitle: 'test title',
  totalScore: 30,
  categoryList: [
    {
      category: 'type a',
      categoryId: 'a1',
      categoryScore: 25,
      questionList: [
        {
          questionText: 'this is question a1',
          questionId: 'a1-01',
          ansState: false,
          singleScore: 0,
          answerOptions: [
            {
              optionText: 'this is choice a1-01-option1',
              optionScore: 0,
              optionId: 'a1-01-option1',
            },
            {
              optionText: 'this is choice a1-01-option2',
              optionScore: 1,
              optionId: 'a1-01-option2',
            },
            {
              optionText: 'this is choice a1-01-option3',
              optionScore: 2,
              optionId: 'a1-01-option3',
            },
            {
              optionText: 'this is choice a1-01-option4',
              optionScore: 3,
              optionId: 'a1-01-option4',
            },
            {
              optionText: 'this is choice a1-01-option5',
              optionScore: 4,
              optionId: 'a1-01-option5',
            },
          ],
        },
        {
          questionText: 'this is question a2',
          questionId: 'a1-02',
          ansState: false,
          singleScore: 0,
          answerOptions: [
            {
              optionText: 'this is choice a1-02-option1',
              optionScore: 0,
              optionId: 'a1-02-option1',
            },
            {
              optionText: 'this is choice a1-02-option2',
              optionScore: 1,
              optionId: 'a1-02-option2',
            },
            {
              optionText: 'this is choice a1-02-option3',
              optionScore: 2,
              optionId: 'a1-02-option3',
            },
            {
              optionText: 'this is choice a1-02-option4',
              optionScore: 3,
              optionId: 'a1-02-option4',
            },
            {
              optionText: 'this is choice a1-02-option5',
              optionScore: 4,
              optionId: 'a1-02-option5',
            },
          ],
        },
        {
          questionText: 'this is question a3',
          questionId: 'a1-03',
          ansState: false,
          singleScore: 0,
          answerOptions: [
            {
              optionText: 'this is choice a1-03-option1',
              optionScore: 0,
              optionId: 'a1-03-option1',
            },
            {
              optionText: 'this is choice a1-03-option2',
              optionScore: 1,
              optionId: 'a1-03-option2',
            },
            {
              optionText: 'this is choice a1-03-option3',
              optionScore: 2,
              optionId: 'a1-03-option3',
            },
            {
              optionText: 'this is choice a1-03-option4',
              optionScore: 3,
              optionId: 'a1-03-option4',
            },
            {
              optionText: 'this is choice a1-03-option5',
              optionScore: 4,
              optionId: 'a1-03-option5',
            },
          ],
        },
      ],
    },
    {
      category: 'type b',
      categoryId: 'b1',
      categoryScore: 25,
      questionList: [
        {
          questionText: 'this is question b1',
          questionId: 'b1-01',
          ansState: false,
          singleScore: 0,
          answerOptions: [
            {
              optionText: 'this is choice b1-01-option1',
              optionScore: 0,
              optionId: 'b1-01-option1',
            },
            {
              optionText: 'this is choice b1-01-option2',
              optionScore: 1,
              optionId: 'b1-01-option2',
            },
            {
              optionText: 'this is choice b1-01-option3',
              optionScore: 2,
              optionId: 'b1-01-option3',
            },
            {
              optionText: 'this is choice b1-01-option4',
              optionScore: 3,
              optionId: 'b1-01-option4',
            },
            {
              optionText: 'this is choice b1-01-option5',
              optionScore: 4,
              optionId: 'b1-01-option5',
            },
          ],
        },
        {
          questionText: 'this is question b2',
          questionId: 'b1-02',
          ansState: false,
          singleScore: 0,
          answerOptions: [
            {
              optionText: 'this is choice b1-02-option1',
              optionScore: 0,
              optionId: 'b1-02-option1',
            },
            {
              optionText: 'this is choice b1-02-option2',
              optionScore: 1,
              optionId: 'b1-02-option2',
            },
            {
              optionText: 'this is choice b1-02-option3',
              optionScore: 2,
              optionId: 'b1-02-option3',
            },
            {
              optionText: 'this is choice b1-02-option4',
              optionScore: 3,
              optionId: 'b1-02-option4',
            },
            {
              optionText: 'this is choice b1-02-option5',
              optionScore: 4,
              optionId: 'b1-02-option5',
            },
          ],
        },
        {
          questionText: 'this is question b3',
          questionId: 'b1-03',
          ansState: false,
          singleScore: 0,
          answerOptions: [
            {
              optionText: 'this is choice b1-03-option1',
              optionScore: 0,
              optionId: 'b1-03-option1',
            },
            {
              optionText: 'this is choice b1-03-option2',
              optionScore: 1,
              optionId: 'b1-03-option2',
            },
            {
              optionText: 'this is choice b1-03-option3',
              optionScore: 2,
              optionId: 'b1-03-option3',
            },
            {
              optionText: 'this is choice b1-03-option4',
              optionScore: 3,
              optionId: 'b1-03-option4',
            },
            {
              optionText: 'this is choice b1-03-option5',
              optionScore: 4,
              optionId: 'b1-03-option5',
            },
          ],
        },
      ],
    },
  ],
}

const answerList = [
  {
    categoryId: 'a1',
    questionId: 'a1-01',
    optionId: '',
    score: 0,
  },
  {
    categoryId: 'a1',
    questionId: 'a1-02',
    optionId: '',
    score: 0,
  },
  {
    categoryId: 'a1',
    questionId: 'a1-03',
    optionId: '',
    score: 0,
  },
  {
    categoryId: 'b1',
    questionId: 'b1-01',
    optionId: '',
    score: 0,
  },
  {
    categoryId: 'b1',
    questionId: 'b1-02',
    optionId: '',
    score: 0,
  },
  {
    categoryId: 'b1',
    questionId: 'b1-03',
    optionId: '',
    score: 0,
  },
]

const Template = (args) => ({
  components: { qaTool },
  setup() {
    return { args }
  },
  template: '<qa-tool ' + 'v-bind="args" ' + '@update:answerList="update" />',
  methods: {
    update: action('update:answerList'),
  },
})

export const Default = Template.bind({})
Default.args = {
  qaList,
  answerList,
}

const TemplateWithScope = (args) => ({
  components: { qaTool },
  setup() {
    return { args }
  },
  template:
    '<qa-tool ' +
    'v-bind="args" ' +
    '@update:answerList="update" >' +
    '<template #extraContents>' +
    '<div>this is for testing slot</div>' +
    '<span class="text-info">i wonder how it works</span><hr>' +
    '</template>' +
    '</qa-tool>',
  methods: {
    update: action('update:answerList'),
  },
})

export const withSlot = TemplateWithScope.bind({})
withSlot.args = {
  qaList,
  answerList,
  extraComponentFlag: [1],
}
