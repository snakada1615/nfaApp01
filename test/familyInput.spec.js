import { mount } from '@vue/test-utils'
import familyInput from '@/components/atoms/familyInput'

describe('familyInput', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(NuxtLogo)
    expect(wrapper.vm).toBeTruthy()
  })
})
