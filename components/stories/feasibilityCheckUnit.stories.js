import { action } from '@storybook/addon-actions'
import feasibilityCheckUnit from '~/components/organisms/feasibilityCheckUnit'
import * as showTargetVolumeStories from '@/components/stories/showTargetVolume.stories'
import * as qaToolStories from '@/components/stories/qaTool.stories'

export default {
  title: 'NFA-app/organisms/feasibilityCheckUnit',
  component: feasibilityCheckUnit,
  argTypes: {},
}

const Template = (args) => ({
  components: { feasibilityCheckUnit },
  setup() {
    return { args }
  },
  template:
    '<feasibilityCheckUnit ' +
    '@update:answerList="updateAnswer" ' +
    '@update:targetInfo="updateTarget" ' +
    'v-bind="args" />',
  methods: {
    updateAnswer: action('updateAnswer'),
    updateTarget: action('updateTarget'),
  },
})

export const Default = Template.bind({})

Default.args = {
  targetInfo: showTargetVolumeStories.Default.args.targetInfo,
  qaList: qaToolStories.withSlot.args.qaList,
  answerList: qaToolStories.withSlot.args.answerList,
  cropName: 'Baka',
  extraComponentFlag: ['a1_a1-02'],
}
