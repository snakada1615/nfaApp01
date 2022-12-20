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

  // テストの度にstoreの内容を初期化(mock作成)
  beforeEach(() => {
    dispatch = jest.fn().mockImplementation((param) => {
      return new Promise((resolve, reject) => {
        if (param === 'fire/loginEmail') {
          state.fire.myApp.current.isLoggedIn = true
          resolve('loginEmail success')
        } else if (param === 'fire/updateIsLoggedIn') {
          resolve(true)
        } else if (param === 'fire/logOut') {
          state.fire.myApp.current.isLoggedIn = false
          resolve(true)
        } else {
          reject(new Error('fail to find param'))
        }
      })
    })

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

    wrapper = mount(userLogin, {
      localVue,
      mocks: {
        $store: {
          state,
          dispatch,
        },
      },
    })
  })

  it('is a Vue instance', async () => {
    const button1 = wrapper.findComponent('#jestButton1')
    const button2 = wrapper.findComponent('#jestButton2')
    const input1 = wrapper.findComponent('#jestInput1')
    const input2 = wrapper.findComponent('#jestInput2')

    // <button1>が表示される
    expect(button1.isVisible()).toBeTruthy()
    expect(button2.isVisible()).toBeTruthy()

    // 初期状態ではloginボタン、logOutボタンはdisabled
    expect(button1.attributes()).toHaveProperty('disabled')
    expect(button2.attributes()).toHaveProperty('disabled')

    // 謝ったname, passをセット(名前に空白文字)
    await input1.setValue('poka9  hontasu')
    await input2.setValue('baka no showko')

    // loginボタンのdisableが付与されたことを確認
    expect(button1.attributes()).toHaveProperty('disabled')

    // 正しいname, passをセット
    await input1.setValue('poka9hontasu')
    await input2.setValue('baka no showko')

    // loginボタンのdisableが解除されたことを確認
    expect(button1.attributes()).not.toHaveProperty('disabled')

    // ボタンクリックでuserとpassがdispatchされることを確認
    button1.trigger('click')

    // dispatchされるactionの確認
    expect(dispatch.mock.calls[0][0]).toEqual('fire/loginEmail')

    // dispatchされるparamの確認
    expect(dispatch.mock.calls[0][1]).toEqual({
      name: 'poka9hontasu',
      password: 'baka no showko',
    })

    console.log(state.fire.myApp.current.isLoggedIn)
    console.log(button2.attributes())

    // ボタンクリックでlogoutがdispatchされることを確認
    button2.trigger('click')
    console.log(dispatch.mock.calls[0])

    // logOutボタンのdisableが解除されたことを確認
    expect(button2.attributes()).not.toHaveProperty('disabled')
  })
})
