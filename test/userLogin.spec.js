import { mount, createLocalVue } from '@vue/test-utils'
import { describe, expect, it } from '@jest/globals'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuex from 'vuex'
import userLogin from '@/pages/userLogin'

// 追加モジュール（bootstrap, vuex）の読み込み
const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)
localVue.use(Vuex)

describe('userLogin', () => {
  let state
  let wrapper
  let dispatch
  let store
  let actions

  // テストの度にstoreの内容を初期化(mock作成)
  beforeEach(() => {
    dispatch = jest.fn().mockImplementation((commandCalled, payload) => {
      return new Promise((resolve, reject) => {
        if (commandCalled === 'fire/loginEmail') {
          resolve('loginEmail success')
        } else if (commandCalled === 'fire/updateIsLoggedIn') {
          console.log('updateIsLoggedIn, Now: ' + payload)
          state.fire.myApp.current.isLoggedIn = payload
          resolve(true)
        } else if (commandCalled === 'fire/logOut') {
          state.fire.myApp.current.isLoggedIn = payload
          resolve(true)
        } else {
          reject(new Error('fail to find commandCalled'))
        }
      })
    })

    actions = {
      fire: {
        loginEmail: jest.fn().mockResolvedValue('loginEmail success'),
        updateIsLoggedIn: jest.fn((value) => value),
        logOut: jest.fn(),
      },
    }
    // storeのモックを作成
    state = {
      fire: {
        myApp: {
          families: [],
          communities: [],
          userInfo: {
            /**
             * 現在のユーザー
             */
            displayName: 'userTest01',
            email: '',
            country: '',
            subnational1: '',
            subnational2: '',
            subnational3: '',
            organization: '',
            title: '',
            uid: 'userTest01',
            phoneNumber: '',
            userType: 'normal',
          },
          /**
           * loadingBox表示用のフラグ
           */
          loadingStatus: false,
          /**
           * 現在選択されているfamily, dietDateを記録
           */
          current: {
            isLoggedIn: false,
            familyName: 'userTest1',
            dietDate: '',
            driName: 'driNew',
            fctName: 'fctNew',
            portionName: 'portion_nakada01',
            countryNamesId: 'countryNames',
            regionId: 'eth_region',
          },
          adminPass: '',
          isUpdateElements: {
            families: false,
            communities: false,
            userInfo: false,
            driObject: false,
            fctObject: false,
            calendar: false,
            portionUnit: false,
          },
        },
        driObject: {},
        fct: [],
        fctObject: {},
        calendar: [],
        portionUnit: [],
      },
    }

    store = new Vuex.Store({
      state,
      actions,
    })
    // wrapper = mount(userLogin, {
    //   localVue,
    //   mocks: {
    //     $store: {
    //       state,
    //       dispatch,
    //     },
    //   },
    // })
  })

  it('shows button-login on startup', () => {
    const button1 = wrapper.findComponent('#jestButton1')
    expect(button1.isVisible()).toBeTruthy()
  })

  it('shows button-logout on startup', () => {
    const button2 = wrapper.findComponent('#jestButton2')
    expect(button2.isVisible()).toBeTruthy()
  })

  it('disable button-login on startup', () => {
    const button1 = wrapper.findComponent('#jestButton1')
    expect(button1.attributes()).toHaveProperty('disabled')
  })

  it('is not logged-in on startup', () => {
    expect(state.fire.myApp.current.isLoggedIn).not.toBeTruthy()
    expect(wrapper.vm.isLoggedIn).not.toBeTruthy()
  })

  it('disable button-logOut on load', () => {
    const button2 = wrapper.findComponent('#jestButton2')
    expect(button2.attributes()).toHaveProperty('disabled')
  })

  it('disable button-login when user input is wrong', async () => {
    const input1 = wrapper.findComponent('#jestInput1')
    const input2 = wrapper.findComponent('#jestInput2')
    const button1 = wrapper.findComponent('#jestButton1')

    // 謝ったname, passをセット(名前に空白文字)
    await input1.setValue('poka9  hontasu')
    await input2.setValue('baka no showko')

    // loginボタンのdisableが付与されたことを確認
    expect(button1.attributes()).toHaveProperty('disabled')
  })

  it('enable button-login when user input is correct', async () => {
    const input1 = wrapper.findComponent('#jestInput1')
    const input2 = wrapper.findComponent('#jestInput2')
    const button1 = wrapper.findComponent('#jestButton1')

    // 正しいname, passをセット
    await input1.setValue('poka9hontasu')
    await input2.setValue('baka no showko')

    // loginボタンのdisableが解除されたことを確認
    expect(button1.attributes()).not.toHaveProperty('disabled')
  })

  it('dispatch user and password when button-login is clicked', async () => {
    const button1 = wrapper.findComponent('#jestButton1')
    const button2 = wrapper.findComponent('#jestButton2')
    const input1 = wrapper.findComponent('#jestInput1')
    const input2 = wrapper.findComponent('#jestInput2')

    // 正しいname, passをセット
    await input1.setValue('poka9hontasu')
    await input2.setValue('baka no showko')

    // ボタンクリックでuserとpassがdispatchされることを確認
    await button1.trigger('click')

    // dispatchされるactionの確認
    expect(dispatch.mock.calls[0][0]).toEqual('fire/loginEmail')

    // dispatchされるparamの確認
    expect(dispatch.mock.calls[0][1]).toEqual({
      name: 'poka9hontasu',
      password: 'baka no showko',
    })

    // loginできたことを確認
    expect(state.fire.myApp.current.isLoggedIn).toBeTruthy()
    expect(wrapper.vm.isLoggedIn).toBeTruthy()

    // logOutボタンのdisableが解除されたことを確認
    console.log(button2.html())
    expect(button2.attributes()).not.toHaveProperty('disabled')
  })
})
