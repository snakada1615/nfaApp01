import { mount, createLocalVue } from '@vue/test-utils'
import { describe, expect, it } from '@jest/globals'
import BootstrapVue from 'bootstrap-vue'
import familyInput from '@/components/atoms/familyInput'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const target = [
  { id: 1, count: 1 },
  { id: 2, count: 5 },
  { id: 3, count: 0 },
]

const dri = [
  {
    En: '1088.0',
    Fe: '5.8',
    max_vol: '900',
    Name: 'child 6-23 month',
    Pr: '11.65',
    Va: '400.0',
    id: 0,
  },
  {
    En: '1288.0',
    Fe: '6.8',
    max_vol: '700',
    Name: 'child 24-50 month',
    Pr: '12.52',
    Va: '300.0',
    id: 3,
  },
]

describe('familyInput', () => {
  it('is a Vue instance', () => {
    const wrapper = mount(familyInput, {
      localVue,
      propsData: {
        target,
        driItems: dri,
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
