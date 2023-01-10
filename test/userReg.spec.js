import { mount, createLocalVue } from '@vue/test-utils'
import { describe, expect, it } from '@jest/globals'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuex from 'vuex'
import userReg from '@/pages/userReg'

// 追加モジュール（bootstrap, vuex）の読み込み
const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)
localVue.use(Vuex)

describe('userLogin', () => {
  let state
  let wrapper
  let store
  let actions
  let getters

  // テストの度にstoreの内容を初期化(mock作成)
  beforeEach(() => {
    actions = {}

    // storeのモックを作成
    state = {
      myApp: {
        userInfo: {
          /**
           * 現在のユーザー
           */
          displayName: 'userTest01',
          uid: 'userTest01',
          phoneNumber: '',
          userType: 'normal',
        },
        /**
         * 現在選択されているfamily, dietDateを記録
         */
        current: {
          isLoggedIn: false,
        },
      },
    }

    getters = { currentFamilyName: () => 'ahobaka' }

    store = new Vuex.Store({
      modules: {
        fire: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    })
  })

  it('shows name-field on startup', () => {
    wrapper = mount(userReg, {
      localVue,
      store,
    })

    const nameField = wrapper.findComponent('#jestForm1')
    expect(nameField.isVisible()).toBeTruthy()
  })

  it('shows password-field on startup', () => {
    wrapper = mount(userReg, {
      localVue,
      store,
    })

    const passwordField = wrapper.findComponent('#jestForm2')
    expect(passwordField.isVisible()).toBeTruthy()
  })

  it('button-register is disabled on startup', () => {
    wrapper = mount(userReg, {
      localVue,
      store,
    })

    const button1 = wrapper.findComponent('#jestButton1')
    expect(button1.isVisible()).toBeTruthy()
    expect(button1.attributes()).toHaveProperty('disabled')
  })

  it('button1 enabled if name and pass set properly', () => {
    wrapper = mount(userReg, {
      localVue,
      store,
    })

    const nameField = wrapper.findComponent('#jestForm1')
    const passwordField = wrapper.findComponent('#jestForm2')
    const button1 = wrapper.findComponent('#jestButton1')

    // name, passをセット
    nameField.setValue('ore nakada')
    passwordField.setValue('nakanoarai')

    // loginボタンのdisableが付与されたことを確認
    expect(button1.attributes()).toHaveProperty('disabled')
  })
})
