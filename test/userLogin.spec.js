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
  let store
  let actions
  let getters

  // テストの度にstoreの内容を初期化(mock作成)
  beforeEach(() => {
    actions = {
      loginEmail: jest.fn().mockImplementation((payLoad) => {
        return new Promise((resolve) => {
          resolve('loginEmail success')
        })
      }),
      updateIsLoggedIn: jest.fn().mockImplementation((payload) => {
        return new Promise((resolve) => {
          // state.myApp.current.isLoggedIn = payload
          resolve('loginStatus changed')
        })
      }),
      logOut: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          // console.log(state.myApp.current.isLoggedIn)
          // state.myApp.current.isLoggedIn = false
          // console.log(state.myApp.current.isLoggedIn)
          resolve('loginStatus changed')
        })
      }),
    }

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

    wrapper = mount(userLogin, {
      localVue,
      store,
    })
  })

  it('shows button-login on startup', () => {
    const button1 = wrapper.findComponent('#jestButton1')
    expect(button1.isVisible()).toBeTruthy()
  })

  it('shows button-logout on startup', () => {
    const button2 = wrapper.findComponent('#jestButton2')
    expect(button2.isVisible()).toBeTruthy()
  })

  it('button-login is disabled on startup', () => {
    const button1 = wrapper.findComponent('#jestButton1')
    expect(button1.attributes()).toHaveProperty('disabled')
  })

  it('Not logged-in on startup', () => {
    expect(state.myApp.current.isLoggedIn).not.toBeTruthy()
    expect(wrapper.vm.isLoggedIn).not.toBeTruthy()
  })

  it('button-logOut is disabled on load', () => {
    const button2 = wrapper.findComponent('#jestButton2')
    expect(button2.attributes()).toHaveProperty('disabled')
  })

  it('button-login is disabled when user input is wrong', async () => {
    const input1 = wrapper.findComponent('#jestInput1')
    const input2 = wrapper.findComponent('#jestInput2')
    const button1 = wrapper.findComponent('#jestButton1')

    // 謝ったname, passをセット(名前に空白文字)
    await input1.setValue('poka9  hontasu')
    await input2.setValue('baka no showko')

    // loginボタンのdisableが付与されたことを確認
    expect(button1.attributes()).toHaveProperty('disabled')
  })

  it('button-login is enabled when user input is correct', async () => {
    const input1 = wrapper.findComponent('#jestInput1')
    const input2 = wrapper.findComponent('#jestInput2')
    const button1 = wrapper.findComponent('#jestButton1')

    // 正しいname, passをセット
    await input1.setValue('poka9hontasu')
    await input2.setValue('baka no showko')

    // loginボタンのdisableが解除されたことを確認
    expect(button1.attributes()).not.toHaveProperty('disabled')
  })

  it(
    'button-login is clicked -> dispatch user&pass -> login success -> ' +
      'button-logout click -> logout success',
    async () => {
      const button1 = wrapper.findComponent('#jestButton1')
      const button2 = wrapper.findComponent('#jestButton2')
      const input1 = wrapper.findComponent('#jestInput1')
      const input2 = wrapper.findComponent('#jestInput2')

      // 正しいname, passをセット
      await input1.setValue('poka9hontasu')
      await input2.setValue('baka no showko')

      // ボタンクリックでuserとpassがdispatchされることを確認
      await button1.trigger('click')

      // DOMの更新を保証
      await wrapper.vm.$nextTick()

      // dispatchされるaction、paramの確認
      expect(actions.loginEmail).toHaveBeenCalledWith(expect.any(Object), {
        name: 'poka9hontasu',
        password: 'baka no showko',
      })

      // updateIsLoggedInが、param = trueで呼ばれたことを確認
      expect(actions.updateIsLoggedIn).toHaveBeenCalledWith(
        expect.any(Object),
        true
      )
      state.myApp.current.isLoggedIn = true

      // loginできたことを確認
      expect(state.myApp.current.isLoggedIn).toBeTruthy()
      expect(wrapper.vm.isLoggedIn).toBeTruthy()
      expect(wrapper.vm.$store.state.fire.myApp.current.isLoggedIn).toBeTruthy()

      // logOutボタンのdisableが解除されたことを確認
      wrapper.vm.$store.state.fire.myApp.current.isLoggedIn = true
      await wrapper.vm.$nextTick()
      expect(button2.attributes()).not.toHaveProperty('disabled')

      // logoutボタンクリック
      await button2.trigger('click')

      // DOMの更新を保証
      await wrapper.vm.$nextTick()

      // dispatchされるactionの確認
      expect(actions.logOut).toHaveBeenCalled()
      wrapper.vm.$store.state.fire.myApp.current.isLoggedIn = false

      // logOutできたことを確認
      expect(state.myApp.current.isLoggedIn).not.toBeTruthy()
      expect(wrapper.vm.isLoggedIn).not.toBeTruthy()
    }
  )
})
