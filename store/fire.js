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
 * @param dri dri(JSON形式)
 * @returns {{}[]}
 */
function formatDri(dri) {
  const res = []
  for (const key of Object.keys(dri)) {
    const resObj = {}
    resObj.En = dri[key].energy
    resObj.Fe = dri[key].fe
    resObj.Pr = dri[key].protein
    resObj.Va = dri[key].vita
    resObj.Name = dri[key].nut_group
    resObj.id = dri[key].id
    resObj.max_vol = dri[key].max_vol
    res.push(resObj)
  }
  return res
}

// /////////////////////////////////////////////////////////////
// ////////////////// ここからstore定義 ///////////////////////////
// ///////////////////////////////////////////////////////////////

export const state = () => ({
  families: [],
  communities: [],
  userInfo: {},
  dri: [],
  fct: [],
  calendar: [],
  portionSize: [],
  /**
   * loadingBox表示用のフラグ
   */
  loadingStatus: false,
})

export const getters = {}

export const mutations = {
  /**
   * Familyの新規追加
   * @param name
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
  updateAppDri(state, payload) {
    state.dri = payload
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

  https://firestore.googleapis.com/
  // google.firestore.v1.Firestore/Listen/
  // channel?VER=8&database=projects%2Fifnaapp01%2Fdatabases%2F(default)
  // &gsessionid=W1XJe055EbOZr44S1phcXN-M9voWyfw7pmOVJ1NqZaI&SID=3WycrZyj9Yvd1Sv6xXZXMw&RID=52804&TYPE=terminate&zx=rpqrrzq1nnj7

  async fireGetDri({ commit }, payload) {
    console.log('get1')
    const dri = await fireGetDoc(payload.collectionId, payload.documentId)
    console.log('get2')
    if (dri) {
      const driArray = formatDri(dri)
      console.log('get3')
      commit('updateAppDri', driArray)
      console.log('get4')
    } else {
      throw new Error('fetchDri fail: no data')
    }
  },

  loadMyApp({ dispatch }) {
    dispatch('fireGetDri', {
      collectionId: 'nfaSharedData',
      documentId: 'dri01',
    })
  },
}
