import { fireSaveDoc, fireGetDoc } from '@/plugins/firebasePlugin'
import { validateDeepObject } from '@/plugins/helper'

/*
const Family = class {
  constructor(name, member = []) {
    if (!Array.isArray(member)) {
      throw new TypeError(
        'Wrong parameter member: ' + typeof member + ',expected Array'
      )
    }
    this._name = name
    this._member = JSON.parse(JSON.stringify(member))
    this._diet = []
    this._recommendedCrops = []
  }

  get name() {
    return this._name
  }

  get member() {
    return this._member
  }

  get diet() {
    return this._diet
  }

  get recommendedCrops() {
    return this._recommendedCrops
  }

  isFamilyEmpty() {
    return this._member.length === 0
  }

  set name(value) {
    this._name = value
  }

  set member(value) {
    if (!Array.isArray(value)) {
      throw new TypeError('wrong parameter: member')
    }

    // valueの内部構造をチェック
    let myType = true
    value.forEach((item) => {
      const res1 = Object.keys(item).includes('id')
      const res2 = Object.keys(item).includes('category')
      const res3 = Object.keys(item).includes('number')
      if (!res1 || !res2 || !res3) {
        myType = false
      }
    })
    if (!myType) {
      throw new TypeError('wrong parameter: member')
    }

    // objectのためdeep copyを実行
    const newArray = JSON.parse(JSON.stringify(value))

    // reactivityを担保するためspliceを使用
    this._member.splice(0, this._member.length, ...newArray)
  }

  nutritionDemands(dri, keys = ['En', 'Pr', 'Va', 'Fe']) {
    return this._member.reduce((accum, current, index) => {
      keys.forEach((nutrientKey) => {
        accum[nutrientKey] += current.number * dri[index][nutrientKey]
      })
      return accum
    }, {})
  }

  set diet(value) {
    if (!Array.isArray(value)) {
      throw new TypeError('wrong parameter: expected Array')
    }

    value.forEach((item) => {
      if (item.constructor.name !== 'Ingredient') {
        throw new Error(
          'wrong type: ' + item.constructor.name + ', expect: Ingredient'
        )
      }
    })

    // objectのためdeep copyを実行
    const newArray = JSON.parse(JSON.stringify(value))
    // reactivityを担保するためspliceを使用
    this._diet.splice(0, this._diet.length, ...newArray)
  }

  addIngredient(value) {
    const myType = value.constructor.name
    if (myType !== 'Ingredient') {
      throw new Error('wrong type: ' + myType + ', expect: Ingredient')
    }

    // reactivityを担保するためspliceを使用
    this._diet.splice(this._diet.length, 0, JSON.parse(JSON.stringify(value)))
  }

  set recommendedCrops(value) {
    const myType = value.constructor.name
    if (myType !== 'RecommendedCrops') {
      throw new Error('wrong type: ' + myType + ', expect: RecommendedCrops')
    }
    this._recommendedCrops = value
  }
}
*/

// const Ingredient = class {
//   constructor(args = {}) {
//     if (args) {
//       this._date = args.date
//       this._menuName = args.menuName
//       this._foodItem = JSON.parse(JSON.stringify(args.foodItem))
//       this._weight = args.weight
//     } else {
//       this._date = ''
//       this._menuName = ''
//       this._foodItem = {}
//       this._weight = 0
//     }
//   }
//
//   setAll(args) {
//     if (!args.date || !args.menuName || !args.foodItem || !args.weight) {
//       throw new Error('Invalid parameter: Ingredient')
//     }
//     this._date = args.date
//     this._menuName = args.menuName
//     this._foodItem = JSON.parse(JSON.stringify(args.foodItem))
//     this._weight = args.weight
//   }
//
//   set date(value) {
//     this._date = value
//   }
//
//   set menuName(value) {
//     this._menuName = value
//   }
//
//   set foodItem(value) {
//     this._foodItem = JSON.parse(JSON.stringify(value))
//   }
//
//   set weight(value) {
//     this._weight = value
//   }
//
//   get date() {
//     return this._date
//   }
//
//   get menuName() {
//     return this._menuName
//   }
//
//   get foodItem() {
//     return this._foodItem
//   }
//
//   get weight() {
//     return this._weight
//   }
// }
//
// const RecommendedCrops = class {
//   constructor(crops = []) {
//     this._isEmpty = true
//     this._crops = []
//   }
// }

// /////////////////////////////////////////////////////////////
// ////////////////// ここからschema定義 ///////////////////////////
// ///////////////////////////////////////////////////////////////

const FamilySchema = {
  name: String,
  member: [
    {
      id: Number,
      count: Number,
    },
  ],
  diet: [
    {
      date: Date,
      menuName: String,
      weight: Number,
      cropInfo: {
        Group: String,
        Name: String,
        food_grp_id: String,
        id: String,
        En: Number,
        Pr: Number,
        Fe: Number,
        Va: Number,
        Carbohydrate: Number,
        Fat: Number,
      },
    },
  ],
  recommendedCrops: [
    {
      month: String,
      keyNutrient: String,
      weight: Number,
      share: Number,
      cropInfo: {
        Group: String,
        Name: String,
        food_grp_id: String,
        id: String,
        En: Number,
        Pr: Number,
        Fe: Number,
        Va: Number,
        Carbohydrate: Number,
        Fat: Number,
      },
      feasibilityScore: [Number],
    },
  ],
}

// /////////////////////////////////////////////////////////////
// ////////////////// ここからfunction定義 ///////////////////////////
// ///////////////////////////////////////////////////////////////

/*
/!**
 * JSON -→ array of objectに変換
 * @param fct fct(JSON形式)
 * @param returnType
 * @returns {{}|*[]}
 *!/
function formatFct(fct, returnType = 1) {
  const resArray = []
  const resObject = {}
  for (const key of Object.keys(fct)) {
    const tempObj = {}
    tempObj.Carbohydrate = fct[key].Carbohydrate
    tempObj.En = fct[key].En
    tempObj.Fe = fct[key].Fe
    tempObj.Fat = fct[key].Fat
    tempObj.Name = fct[key].Name
    tempObj.Pr = fct[key].Pr
    tempObj.Va = fct[key].Va
    tempObj.Group = fct[key].Group
    tempObj.food_grp_id = fct[key].food_grp_id
    tempObj.id = fct[key].id
    resArray.push(tempObj)
    resObject[key] = tempObj
  }
  if (returnType === 1) {
    return resArray
  } else {
    return resObject
  }
}
*/
/*
/!**
 * JSON -→ array of objectに変換
 * @param dri
 * @param returnType
 * @returns {{}|*[]}
 *!/
function formatDri(dri, returnType = 1) {
  const resArray = []
  const resObject = {}
  for (const key of Object.keys(dri)) {
    const tempObj = {}
    tempObj.En = dri[key].energy
    tempObj.Fe = dri[key].fe
    tempObj.Pr = dri[key].protein
    tempObj.Va = dri[key].vita
    tempObj.Name = dri[key].nut_group
    tempObj.id = dri[key].id
    tempObj.max_vol = dri[key].max_vol
    resArray.push(tempObj)
    resObject[key] = tempObj
  }
  if (returnType === 1) {
    return resArray
  } else {
    return resObject
  }
}
*/

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
  portionSize: [],
  /**
   * loadingBox表示用のフラグ
   */
  loadingStatus: false,
  isUpdateElements: {
    families: false,
    communities: false,
    userInfo: false,
    dri: false,
    driObject: false,
    fct: false,
    fctObject: false,
    calendar: false,
    portionSize: false,
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
  FoodGrp(state) {
    const uniqueGroup = []
    const result = []
    if (state.fct) {
      state.fct.forEach(function (elem) {
        if (!uniqueGroup.includes(elem.Group)) {
          uniqueGroup.push(elem.Group)
          result.push({
            name: elem.Group,
          })
        }
      })
    }
    return result
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
    // 名前が指定されていなければ何もしない
    if (!payload.name) {
      return
    }

    // 名前が重複していたらreturn
    console.log(state.families)
    if (state.families.find((item) => item.name === payload)) {
      throw new Error('family name duplication')
    }
    const family = {}
    family.name = payload.name
    family.member = JSON.parse(JSON.stringify(payload.member))
    family.diet = []
    family.recommendedCrops = []
    state.families.push(family)
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
    payload.forEach((item) => {
      console.log(item)
      validateDeepObject(item, FamilySchema)
    })

    // objectのためdeep copyを実行
    const newArray = JSON.parse(JSON.stringify(payload))

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
    state.driObject = payload
  },
  updateFct(state, payload) {
    state.fct = payload
  },
  updateFctObject(state, payload) {
    state.fctObject = payload
  },
}

export const actions = {
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
      // const portionUnitArray = formatPortionUnit(portionUnit)
      const portionUnitArray = []
      commit('updatePortionUnit', portionUnitArray)
    } else {
      throw new Error('fetchPortionUnitFromFire fail: no data')
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
      throw new Error('fetchDri fail: no data')
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
    const res = JSON.parse(JSON.stringify(state.families)).filter(
      (item) => item.name !== payload
    )
    commit('updateFamilies', res)
  },
  async saveDri({ state }) {
    const driBack = {}
    state.dri.forEach((item) => {
      driBack[item.id] = JSON.parse(JSON.stringify(item))
    })
    await fireSaveDoc('nfaSharedData', 'driNew', driBack)
  },
}
