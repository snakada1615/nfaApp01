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
  families: [],
  communities: [],
  userInfo: {},
  dri: [],
  driObject: {},
  fct: [],
  fctObject: {},
  calendar: [],
  portionUnit: [],
  /**
   * loadingBox表示用のフラグ
   */
  loadingStatus: false,
  /**
   * 現在選択されているfamily, dietDateを記録
   */
  current: {
    familyName: 'userTest1',
    dietDate: '',
  },
  isUpdateElements: {
    families: false,
    communities: false,
    userInfo: false,
    dri: false,
    driObject: false,
    fct: false,
    fctObject: false,
    calendar: false,
    portionUnit: false,
  },
})

export const getters = {
  initialMembers(state) {
    return state.dri.map((item) => {
      return {
        id: item.id,
        name: item.Name,
        number: 0,
      }
    })
  },
  familyList(state) {
    return state.families.map((item) => {
      return item.name
    })
  },
  surveyDateList(state) {
    // let errPath
    // validateDeepObject(state.families, FamilySchema, errPath)
    const resObject = {}
    state.families.forEach((item) => {
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
    Object.values(state.isUpdateElements).forEach((item) => {
      if (item) {
        res = true
      }
    })
    return res
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
   * 要素ごとのupdateの状況を設定
   * @param state
   * @param payload
   */
  setUpdateFlag(state, payload) {
    state.isUpdateElements[payload.element] = payload.value
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
    if (state.families.find((item) => item.name === payload)) {
      throw new Error('family name duplication')
    }
    // memberの型チェック:失敗したらerror
    let errPath
    console.log(payload.member)
    validateDeepObject(payload.member, familyMemberSchema, errPath)

    // payloadを初期値として含むnewFamilyを初期化
    const newFamily = initObject(payload, SingleFamilySchema)

    // newFamilyの値をfamiliesに追加
    state.families.splice(state.families.length, 0, newFamily)
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

    state.families[payload.name].diet = Object.assign({}, payload.diet)
  },

  /**
   * familiesの更新
   * @param state
   * @param payload
   */
  updateFamilies(state, payload) {
    if (!Array.isArray(payload)) {
      throw new TypeError(
        'wrong parameter:' + typeof payload + 'expected Array'
      )
    }
    let errPath
    validateDeepObject(payload, FamilySchema, errPath)

    // objectのためdeep copyを実行
    const newArray = payload.map((item) => ({ ...item }))

    // reactivityを担保するためspliceを使用
    state.families.splice(0, state.families.length, ...newArray)
  },

  /**
   * 外部データの読み込み時のstatus表示用フラグ
   * @param state
   * @param payload
   */
  updateLoadingState(state, payload) {
    state.loadingStatus = payload
  },
  updateDri(state, payload) {
    state.dri = payload
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
}

export const actions = {
  /**
   * families[].dietを更新
   * @param state
   * @param payload
   */
  updateDiet({ commit }, payload) {
    commit('updateDiet', payload)
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
    return await fireGetDoc(payload.collectionId, payload.documentId)
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
      state.myApp.dataSet.cropCalendarId
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
      state.myApp.dataSet.questionsId
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
      throw err
    })
    if (dri) {
      commit('updateDri', Object.values(dri))
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
      throw err
    })
    if (fct) {
      commit('updateFct', Object.values(fct))
      commit('updateFctObject', fct)
    } else {
      throw new Error('fetchFct fail: no data')
    }
  },

  async loadMyApp({ dispatch }) {
    dispatch('updateLoadingState', true)
    await dispatch('fireGetDri', {
      collectionId: 'nfaSharedData',
      documentId: 'driNew',
    })
    await dispatch('fireGetFct', {
      collectionId: 'nfaSharedData',
      documentId: 'fctNew',
    })
    await dispatch('fireGetPortionUnit', {
      collectionId: 'nfaSharedData',
      documentId: 'portion_nakada01',
    })
    dispatch('updateLoadingState', false)
  },

  async fireSaveMyApp({ dispatch, state }) {
    const targetDoc = Object.entries(state.isUpdateElements)
      .filter(([key, value]) => value === true)
      .map((item) => {
        return item[0]
      })
    dispatch('updateLoadingState', true)
    for (const item of targetDoc) {
      const myDoc = {}
      myDoc[item] = state[item]
      await fireSaveDoc('nfaUserData', 'userTest01', myDoc).catch((err) => {
        console.log(err)
      })
      dispatch('setUpdateFlag', {
        element: item,
        value: false,
      })
    }
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
    const res = state.families.filter((item) => item.name !== payload)
    commit('updateFamilies', res)
  },
  async saveDri({ state }) {
    const driBack = {}
    state.dri.forEach((item) => {
      driBack[item.id] = item
    })
    await fireSaveDoc('nfaSharedData', 'driNew', driBack)
  },
}
