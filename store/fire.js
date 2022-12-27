import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  DietSchema,
  familyMemberSchema,
  FamilySchema,
  initObject,
  SingleFamilySchema,
} from '../plugins/helper'
import { fireSaveDoc, fireGetDoc } from '@/plugins/firebasePlugin'
import { foodGroup, validateDeepObject } from '@/plugins/helper'

// /////////////////////////////////////////////////////////////
// ////////////////// ここからstore定義 ///////////////////////////
// ///////////////////////////////////////////////////////////////

export const state = () => ({
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
})

export const getters = {
  fctArray(state) {
    return Object.values(state.fctObject)
  },
  driArray(state) {
    return Object.values(state.driObject)
  },
  initialMembers(state) {
    return Object.values(state.driObject).map((item) => {
      return {
        id: item.id,
        name: item.Name,
        number: 0,
      }
    })
  },
  familyList(state) {
    return state.myApp.families.map((item) => {
      return item.name
    })
  },
  surveyDateList(state) {
    // let errPath
    // validateDeepObject(state.families, FamilySchema, errPath)
    const resObject = {}
    state.myApp.families.forEach((item) => {
      const res = []
      for (const item2 in item.diet) {
        res.push(item2.date)
      }
      resObject[item.name] = res
    })
    return resObject
  },
  isUpdateAny(state) {
    let res = false
    Object.values(state.myApp.isUpdateElements).forEach((item) => {
      if (item) {
        res = true
      }
    })
    return res
  },
  currentFamilyName(state) {
    const email = state.myApp.userInfo.email
    return email.substring(0, email.indexOf('@'))
  },
  /**
   * FCTに含まれるFood Groupの一覧
   * @returns {*[]}
   * @constructor
   */
  foodGroup(state) {
    return foodGroup(state.fct)
  },
}

export const mutations = {
  /**
   * ユーザー情報をfireAuthから得たログイン情報に基づいて初期化する
   * @param state
   * @param payload
   */
  initUser(state, payload) {
    state.myApp.userInfo.uid = payload.uid
    state.myApp.userInfo.displayName = payload.displayName
    state.myApp.userInfo.email = payload.email
    state.myApp.userInfo.phoneNumber = payload.phoneNumber
    state.myApp.userInfo.country = payload.country || ''
    state.myApp.userInfo.subnational1 = payload.subnational1 || ''
    state.myApp.userInfo.subnational2 = payload.subnational2 || ''
    state.myApp.userInfo.subnational3 = payload.subnational3 || ''
    state.myApp.userInfo.organization = payload.organization || ''
    state.myApp.userInfo.title = payload.title || ''
    state.myApp.userInfo.userType = payload.userType || 'normal'
  },

  /**
   * persistant
   * @returns {Promise<unknown>}
   */
  getCurrentLogin() {
    return new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged((user) => {
        // user オブジェクトを resolve
        if (user) {
          resolve(user)
        } else {
          reject(new Error('no login'))
        }
        // 登録解除
        unsubscribe()
      })
    })
  },

  /**
   * ログイン状態を更新
   * @param state
   * @param {boolean} payload ログイン状態
   */
  updateIsLoggedIn(state, payload) {
    state.myApp.current.isLoggedIn = payload
  },
  /**
   * 要素ごとのupdateの状況を設定
   * @param state
   * @param payload
   */
  setUpdateFlag(state, payload) {
    state.myApp.isUpdateElements[payload.element] = payload.value
  },

  /**
   * Familyの新規追加
   * @param state
   * @param payload
   */
  addNewFamily(state, payload) {
    // payloadには少なくともnameとmemberを含む必要がある
    // 名前が指定されていなければ何もしない
    if (!payload.name) {
      return
    }

    // nameのチェック。名前が重複していたらerror
    if (state.myApp.families.find((item) => item.name === payload)) {
      throw new Error('family name duplication')
    }
    // memberの型チェック:失敗したらerror
    validateDeepObject(payload.member, familyMemberSchema)

    // payloadを初期値として含むnewFamilyを初期化
    const newFamily = initObject(payload, SingleFamilySchema)

    // newFamilyの値をfamiliesに追加
    state.myApp.families.splice(state.myApp.families.length, 0, newFamily)
  },

  /**
   * families[].dietを更新
   * @param state
   * @param payload
   */
  updateDiet(state, payload) {
    // 名前が指定されていなければ何もしない
    if (!payload.name) {
      throw new TypeError('error.typeError')
    }

    // 型チェック:失敗したらerror
    let errPath
    validateDeepObject(payload.diet, DietSchema, errPath)

    state.myApp.families[payload.name].diet = Object.assign({}, payload.diet)
  },

  /**
   * familiesの更新
   * @param state
   * @param payload
   */
  updateFamilies(state, payload) {
    validateDeepObject(payload, FamilySchema)

    // objectのためdeep copyを実行
    // const newArray = payload.map((item) => ({ ...item }))

    // reactivityを担保するためspliceを使用
    state.myApp.families.splice(0, state.myApp.families.length, ...payload)
  },

  /**
   * 外部データの読み込み時のstatus表示用フラグ
   * @param state
   * @param payload
   */
  updateLoadingState(state, payload) {
    state.myApp.loadingStatus = payload
  },
  updateDriObject(state, payload) {
    state.driObject = Object.assign({}, payload)
  },
  updateFct(state, payload) {
    state.fct = payload
  },
  updateFctObject(state, payload) {
    state.fctObject = Object.assign({}, payload)
  },
  updatePortionUnit(state, payload) {
    state.portionUnit = payload
  },
  /**
   * regionIdを更新
   * @param state
   * @param payload
   */
  updateRegionId(state, payload) {
    state.myApp.current.regionId = payload
  },
}

export const actions = {
  /**
   * ログイン状態のフラグ更新
   * @param commit
   * @param payload
   */
  updateIsLoggedIn({ commit }, payload) {
    commit('updateIsLoggedIn', payload)
  },

  /**
   * families[].dietを更新
   * @param state
   * @param payload
   */
  updateDiet({ commit }, payload) {
    commit('updateDiet', payload)
  },

  /**
   * ユーザー情報をpayloadで与えられた内容で更新する
   * @param commit
   * @param payload
   */
  initUser({ commit }, payload) {
    commit('initUser', payload)
  },

  /**
   * 要素ごとのupdateの状況を設定
   * @param state
   * @param payload
   */
  setUpdateFlag({ commit }, payload) {
    commit('setUpdateFlag', payload)
  },
  /**
   * loadingStatusの更新
   * @param commit
   * @param payload
   */
  updateLoadingState({ commit }, payload) {
    commit('updateLoadingState', payload)
  },
  async fireGetMyApp({ commit }, payload) {
    const myApp = await fireGetDoc(payload.collectionId, payload.documentId)
    if (myApp) {
      commit('updateFamilies', myApp.families)
    }
  },

  async fireGetPortion({ commit }, payload) {},
  /**
   * PortionUnitのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  async fireGetPortionUnit({ state, commit, dispatch }, payload) {
    const portionUnit = await fireGetDoc(
      payload.collectionId,
      payload.documentId
    ).catch((err) => {
      throw err
    })

    // portionUnitをstoreに保存
    if (portionUnit) {
      commit('updatePortionUnit', Object.values(portionUnit))
    } else {
      throw new Error('fetchPortion fail: no data')
    }
  },
  /**
   * cropCalendarのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @param payload 初期値（db名）の指定があれば、これを元に初期化
   * @returns {Promise<void>}
   */
  async fireGetCropCalendar({ state, commit, dispatch }, payload) {
    if (payload) {
      await commit('updateCropCalendarId', payload)
    }
    // cropCalendarをfireStoreからfetch (cropCalendarIdを使う)
    const cropCalendar = await fireGetDoc(
      'dataset',
      state.myApp.current.cropCalendarId
    ).catch((err) => {
      throw new Error(err)
    })

    // cropCalendarをstoreに保存
    if (cropCalendar) {
      const cropCalendarArray = Object.values(cropCalendar)
      console.log(cropCalendarArray)
      commit('updateCropCalendar', cropCalendarArray)
    } else {
      throw new Error('fetchCropCalendarFromFire fail: no data')
    }
  },
  /**
   * questionsのデータをfireStoreから取得して返す
   * @param state
   * @param commit
   * @param dispatch
   * @returns {Promise<void>}
   */
  async fetchQuestionsFromFire({ state, commit, dispatch }) {
    // questionsをfireStoreからfetch (questionsIdを使う)
    const questions = await fireGetDoc(
      'dataset',
      state.myApp.current.questionsId
    ).catch((err) => {
      throw new Error(err)
    })

    // questionsをstoreに保存
    if (questions) {
      // const questionsArray = formatQuestions(questions)
      const questionsArray = []
      commit('updateQuestions', questionsArray)
    } else {
      throw new Error('fetchQuestionsFromFire fail: no data')
    }
  },
  async fireGetDri({ commit }, payload) {
    const dri = await fireGetDoc(
      payload.collectionId,
      payload.documentId
    ).catch((err) => {
      console.error(err)
    })
    if (dri) {
      commit('updateDriObject', dri)
    } else {
      throw new Error('fetchDri fail: no data')
    }
  },

  async fireGetFct({ commit }, payload) {
    const fct = await fireGetDoc(
      payload.collectionId,
      payload.documentId
    ).catch((err) => {
      console.error(err)
    })
    if (fct) {
      commit('updateFctObject', fct)
    } else {
      throw new Error('fetchFct fail: no data')
    }
  },

  async loadMyApp({ state, dispatch }) {
    dispatch('updateLoadingState', true)
    await dispatch('fireGetDri', {
      collectionId: 'nfaSharedData',
      documentId: state.myApp.current.driName,
    })
    await dispatch('fireGetFct', {
      collectionId: 'nfaSharedData',
      documentId: state.myApp.current.fctName,
    })
    await dispatch('fireGetPortionUnit', {
      collectionId: 'nfaSharedData',
      documentId: 'portion_nakada01',
    })
    await dispatch('fireGetMyApp', {
      collectionId: 'nfaUserData',
      documentId: state.myApp.userInfo.displayName,
    })
    dispatch('updateLoadingState', false)
  },

  async fireSaveMyApp({ dispatch, state }) {
    // loading screenの表示
    dispatch('updateLoadingState', true)

    await fireSaveDoc('nfaUserData', 'userTest01', {
      families: state.myApp.families,
      communities: state.myApp.communities,
      userInfo: state.myApp.userInfo,
      current: state.myApp.current,
    }).catch((err) => {
      console.log(err)
      alert(err)
      dispatch('updateLoadingState', false)
    })

    // 更新フラグをtrueに戻す
    Object.entries(state.myApp.isUpdateElements).forEach(([key, value]) => {
      dispatch('setUpdateFlag', {
        element: key,
        value: true,
      })
    })
    dispatch('updateLoadingState', false)
  },

  /**
   * Familyの新規追加
   * @param state
   * @param payload
   */
  addNewFamily({ commit }, payload) {
    commit('addNewFamily', payload)
  },
  removeFamily({ state, commit }, payload) {
    const res = state.myApp.families.filter((item) => item.name !== payload)
    commit('updateFamilies', res)
  },
  async fireSaveDri({ state }) {
    await fireSaveDoc(
      'nfaSharedData',
      state.myApp.current.driName,
      state.driObject
    )
  },

  /**
   * ログアウト機能
   * @param commit
   * @returns {Promise<void>}
   */
  logOut({ commit }) {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        commit('updateIsLoggedIn', false)
        // リロード
        window.location.reload()
        // this.$router.push('/')
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code
        const errorMessage = error.message
        console.log('guest login error: ', errorCode, errorMessage)
        throw error
      })
  },

  /**
   * 永続化したログイン情報を取得
   * @returns {Promise<unknown>}
   */
  getCurrentLogin() {
    return new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged((user) => {
        // user オブジェクトを resolve
        if (user) {
          resolve(user)
        } else {
          reject(new Error('no login'))
        }
        // 登録解除
        unsubscribe()
      })
    })
  },

  /**
   * name/passwordでログイン(signInWithEmailAndPasswordを流用)
   * @param commit
   * @param payload ログイン情報
   *     {payload.name, payload.password}
   * @param state
   * @returns {Promise<void>}
   */
  async loginEmail({ commit, dispatch, state }, payload) {
    // 名前をemailに変換してから認証
    const auth = getAuth()
    const email = payload.name + '@ifna.app'

    // 認証
    const res = await signInWithEmailAndPassword(
      auth,
      email,
      payload.password
    ).catch((error) => {
      // login状態をfalseでセット
      commit('updateIsLoggedIn', false)

      // errorメッセージ出力
      const errorCode = error.code
      const errorMessage = error.message
      console.log('login error: ' + errorCode + ': ' + errorMessage)
      throw error
    })
    const user = res.user
    commit('initUser', user)

    // login状態をtrueでセット
    commit('updateIsLoggedIn', true)
    console.log('login success')

    // 認証状態の永続性をsetPersistenceで設定
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // 成功したらtopページに移動
        // this.$router.push('/')
      })
      .catch((error) => {
        // 永続性の確保失敗
        const errorCode = error.code
        const errorMessage = error.message
        alert(
          'failed to acquire persistent login status: ' +
            errorCode +
            '-' +
            errorMessage
        )
        throw error
      })
  },

  /**
   * name/passwordでアカウント作成(signInWithEmailAndPasswordを流用)
   *     アカウント作成後に、基本DBをユーザー用に複製(fct, dri)
   * @param commit
   * @param state
   * @param dispatch
   * @param payload
   * @returns {Promise<void>}
   */
  async registerEmail({ commit, state, dispatch }, payload) {
    const auth = getAuth()
    const email = payload.name + '@ifna.app'
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      payload.password
    ).catch((error) => {
      commit('updateIsLoggedIn', false)
      throw error
      // ..
    })
    await dispatch('updateUser', {
      displayName: payload.name,
      email,
    }).catch((error) => {
      commit('updateIsLoggedIn', false)
      throw error
      // ..
    })

    commit('initUser', res.user)
    commit('updateIsLoggedIn', true)
    console.log('login success')
    /**
     * 認証状態の永続性についてはsetPersistenceで設定
     */
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('keeping state')
        // topページに移動
        this.$router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('keeping state error: ', errorCode, errorMessage)
        throw error
      })
  },

  /**
   * CountryNamesのデータをfireStoreから取得して返す
   * @param state
   * @returns {Promise<*>}
   */
  async initCountryNames({ state }) {
    const countries = await fireGetDoc(
      'nfaSharedData',
      state.myApp.current.countryNamesId
    ).catch((err) => {
      throw new Error(err)
    })
    if (countries) {
      return countries
    } else {
      throw new Error('initCountryNames fail: no data')
    }
  },

  /**
   * RegionのデータをfireStoreから取得して返す
   * @param state
   * @returns {Promise<*>}
   */
  async initRegion({ state }) {
    const region = await fireGetDoc(
      'nfaSharedData',
      state.myApp.current.regionId
    ).catch((err) => {
      throw new Error(err)
    })
    if (region) {
      return region
    } else {
      throw new Error('initRegion fail: no data')
    }
  },
}
