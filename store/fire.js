import { fireGetDoc } from '@/plugins/firebasePlugin'
import { validateDeepObject } from '@/plugins/helper'

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

/**
 * JSON -→ array of objectに変換
 * @param fct fct(JSON形式)
 * @param returnType
 * @returns {{}|*[]}
 */
function formatFct(fct, returnType = 1) {
  const resArray = []
  const resObject = {}
  for (const key of Object.keys(fct)) {
    const tempObj = {}
    tempObj.Carbohydrate = fct[key].Carbohydrate
    tempObj.En = fct[key].Energy
    tempObj.Fe = fct[key].FE
    tempObj.Fat = fct[key].Fat
    tempObj.Name = fct[key].Food_name
    tempObj.Pr = fct[key].Protein
    tempObj.Va = fct[key].VITA_RAE
    tempObj.Group = fct[key].food_group_unicef
    tempObj.food_grp_id = fct[key].food_grp_id
    tempObj.id = fct[key].FCT_id
    resArray.push(tempObj)
    resObject[key] = tempObj
  }
  if (returnType === 1) {
    return resArray
  } else {
    return resObject
  }
}
/**
 * JSON -→ array of objectに変換
 * @param dri
 * @param returnType
 * @returns {{}|*[]}
 */
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
}

export const mutations = {
  /**
   * Familyの新規追加
   * @param state
   * @param payload
   */
  addNewFamily({ state }, payload) {
    // 名前が重複していたらreturn
    if (state.families.find((item) => item.name === payload)) {
      throw new Error('family name duplication')
    }
    const family = new Family(name)
    state.families.push(family)
  },

  /**
   * familiesの更新
   * @param state
   * @param payload
   */
  updateFamilies({ state }, payload) {
    if (!Array.isArray(payload)) {
      throw new TypeError(
        'wrong parameter:' + typeof payload + 'expected Array'
      )
    }
    payload.forEach((item) => {
      validateDeepObject(item, FamilySchema)
    })

    // objectのためdeep copyを実行
    const newArray = JSON.parse(JSON.stringify(payload))

    // reactivityを担保するためspliceを使用
    state.families.splice(0, this.families.length, ...newArray)
  },

  /**
   * 外部データの読み込み時のstatus表示用フラグ
   * @param state
   * @param payload
   */
  updateLoadingState(state, payload) {
    state.loadingStatus = payload
  },
  updateAppFamily(state, payload) {
    state.family = payload
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

  async fireGetDri({ commit }, payload) {
    const dri = await fireGetDoc(
      payload.collectionId,
      payload.documentId
    ).catch((err) => {
      throw err
    })
    if (dri) {
      const driArray = formatDri(dri, 1)
      const driObject = formatDri(dri, 2)
      commit('updateDri', driArray)
      commit('updateDriObject', driObject)
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
      const fctArray = formatFct(fct, 1)
      const fctObject = formatFct(fct, 2)
      commit('updateFct', fctArray)
      commit('updateFctObject', fctObject)
    } else {
      throw new Error('fetchDri fail: no data')
    }
  },

  async loadMyApp({ dispatch }) {
    await dispatch('fireGetDri', {
      collectionId: 'nfaSharedData',
      documentId: 'dri01',
    })
    await dispatch('fireGetFct', {
      collectionId: 'nfaSharedData',
      documentId: 'fct_eth0729_rev',
    })
  },
}
