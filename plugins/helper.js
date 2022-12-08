// **************************************************************************
// ***** こちらは共通変数の定義 *************************************************
// **************************************************************************

// /////////////////////////////////////////////////////////////
// ////////////////// ここからschema定義 ///////////////////////////
// ///////////////////////////////////////////////////////////////

export const fctSchema = [
  {
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
]

export const driSchema = [
  {
    Name: String,
    id: String,
    En: Number,
    Pr: Number,
    Fe: Number,
    Va: Number,
    max_vol: Number,
  },
]

export const FamilySchema = [
  {
    name: String,
    member: [
      {
        id: String,
        name: String,
        number: Number,
      },
    ],
    diet: [
      {
        date: Date,
        foodName: String,
        Wt: Number,
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
  },
]

export const SingleFamilySchema = {
  name: String,
  member: [
    {
      id: String,
      name: String,
      number: Number,
    },
  ],
  diet: [
    {
      date: Date,
      foodName: String,
      Wt: Number,
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

export const DietSchema = [
  {
    date: String,
    foodName: String,
    Wt: Number,
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
]

export const familyMemberSchema = [
  {
    id: String,
    name: String,
    number: Number,
  },
]

// **************************************************************************
// ***** こちらは共通関数の定義 *************************************************
// **************************************************************************

/**
 * Object validation
 *     Objectであるかどうかチェック
 * @param item 検査対象の変数
 * @returns {boolean}
 */
export function isObject(item) {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

/**
 * nested Objectの型チェック
 * @param obj チェックするターゲット
 * @param schema 型定義のためのスキーマ
 * @param path どこで問題があったかを示す
 * @returns {boolean}
 */
export function validateDeepObject(obj, schema, path = '') {
  let ok

  if (obj == null) ok = obj === schema
  else if (typeof schema === 'function') {
    ok = obj.constructor === schema
  } else if (typeof obj !== 'object') ok = obj === schema
  else if (Array.isArray(schema))
    ok =
      Array.isArray(obj) &&
      obj.every((x, k) =>
        validateDeepObject(x, schema[0], path + '[' + k + ']')
      )
  else {
    const ko = Object.keys(obj)
    const ks = Object.keys(schema)
    ok =
      ko.length === ks.length &&
      ks.every((k) => validateDeepObject(obj[k], schema[k], path + '.' + k))
  }
  if (!ok) throw new TypeError('Wrong parameter in ' + path)
  return true
}

// example usage:
/*
const OBJECT_SCHEMA = {
  name: String,
  data: [{
    isSelected: Boolean,
    mId: String,
    omnReplaceDict: {
      id: String,
      text: {
        deepObj: {
          deepProp: [Number]
        }

      },
    },
  }],
};

const obj = {
  name: "foo",
  data: [{
    isSelected: true,
    mId: "bar",
    omnReplaceDict: {
      id: "foo",
      text: {
        deepObj: {
          deepProp: [1, 2, "???", 3]
        }

      },
    },
  }]
};

validate(obj, OBJECT_SCHEMA)
*/

/**
 * deepObjectを、objの初期値とschemaの型指定に沿って初期化
 * @param obj 初期値
 * @param schema 型指定
 * @returns {{}|null|*[]|*}
 */
export function initObject(obj, schema) {
  if (typeof schema === 'function') {
    // schema(obj)が0あるいはそれ以外の値の場合意外にnull
    if (schema(obj) == null) {
      return null
    } else {
      return schema(obj)
    }
  } else if (typeof obj !== 'object') {
    // objがfunctionでもObjectでもない場合にスキップ
    return null
  } else if (Array.isArray(schema)) {
    if (Array.isArray(obj) && obj.length > 0) {
      return obj.map((item) => {
        return initObject(item, schema[0])
      })
    } else {
      return []
    }
  } else {
    const keySchema = Object.keys(schema)
    const res = {}
    keySchema.forEach((item) => {
      const itemKeyObject = obj[item]
      res[item] = initObject(itemKeyObject, schema[item])
    })
    return res
  }
}

/**
 * CSVなどの生データに変数の型を付与する（予め定義されたschemaに沿って）
 * @param obj 生データ
 * @param schema 各変数の型情報
 * @returns {{}|null|*}
 */
export function setTypeOfDeepObject(obj, schema) {
  if (obj == null || Array.isArray(obj)) {
    // objがnullの際にスキップ
    return null
  } else if (typeof schema === 'function') {
    // schema(obj)が0あるいはそれ以外の値の場合意外にnull
    if (schema(obj) == null) {
      return null
    } else {
      return schema(obj)
    }
  } else if (typeof obj !== 'object') {
    // objがfunctionでもObjectでもない場合にスキップ
    return null
  } else if (Array.isArray(schema)) {
    if (Array.isArray(obj) && obj.length > 0) {
      return obj.map((item) => {
        return setTypeOfDeepObject(item, schema[0])
      })
    } else {
      return []
    }
  } else {
    const keySchema = Object.keys(schema)
    const res = {}
    keySchema.forEach((item) => {
      const itemKeyObject = obj[item]

      if (itemKeyObject) {
        res[item] = setTypeOfDeepObject(itemKeyObject, schema[item])
      } else {
        res[item] = null
      }
    })
    return res
  }
}

/**
 * 型付きのObjectをsourceObjからdestObjに代入
 * @param newObj
 * @param currentObj
 * @param schema
 * @returns {boolean}
 */
export function updateDeepObject(newObj, currentObj, schema) {
  const mergeObj = Object.assign(currentObj, newObj)
  return setTypeOfDeepObject(mergeObj, schema)
}

/**
 * 数字の桁数を３桁に自動調整し、単位を追記して返す
 * @param val
 * @param unitKey
 * @returns {string}
 */
export function setDigit(val, unitKey) {
  let res
  const units = [
    { 1: ' KC', 2: ' MC', 3: ' GC' }, // for dietary energy
    { 1: ' g', 2: ' kg', 3: ' t' }, // for protein
    { 1: ' µg', 2: ' mg', 3: ' g' }, // for vit-A
    { 1: ' mg', 2: ' g', 3: ' kt' }, // for iron
  ]
  const item = Number(val || 0)
  switch (true) {
    case item < 1000:
      res = String(Math.round(item)) + units[unitKey]['1']
      break
    case item >= 1000 && item < 1000000:
      res = String(Math.round(item / 1000)) + units[unitKey]['2']
      break
    case item >= 1000000:
      res = String(Math.round(item / 1000000)) + units[unitKey]['3']
      break
    default:
      console.log('parameter not valid:setDigit')
      res = ''
      break
  }
  return res
}

/**
 * toastをどこでも表示、vmには「this」を入れる
 * @param vm
 * @param message
 * @param options
 */
export function makeToast(vm, message = 'test', options = {}) {
  vm.$bvToast.toast(message, {
    title: options.title || 'message',
    variant: options.variant || 'danger',
    autoHideDelay: options.autoHideDelay || 5000,
    appendToast: options.autoHideDelay || true,
    'no-auto-hide': options.noAutoHide || false,
    solid: true,
  })
}

export function nutritionDemands(
  driObject,
  member,
  keys = ['En', 'Pr', 'Va', 'Fe'],
  returnType = 1 // 1: return Object（参照が容易）, 2: return Array of Object (table表示に適当)
) {
  let returnObject = {}
  const returnArray = []

  // 初期値の設定
  const initValue = {}
  keys.forEach((nutrientKey) => {
    initValue[nutrientKey] = 0
  })

  returnObject = member.reduce((accum, current) => {
    keys.forEach((nutrientKey) => {
      // accum[nutrientKey] += current.number * driObject[current.id][nutrientKey]
      // Objectの値をレスポンシブにするためにObject.assignを使う
      // const temp = {}
      // temp[nutrientKey] =
      //   accum[nutrientKey] + current.number * driObject[current.id][nutrientKey]
      accum = Object.assign(accum, {
        nutrientKey:
          accum[nutrientKey] +
          current.number * driObject[current.id][nutrientKey],
      })
    })
    return accum
  }, initValue)

  // 利用目的に応じてObjectまたはArrayを返す
  if (returnType === 2) {
    Object.keys(returnObject).forEach((key) => {
      returnArray.push({
        name: key,
        value: returnObject[key],
      })
    })
    return returnArray
  } else {
    return returnObject
  }
}

/**
 * FCTに含まれるFood Groupの一覧
 * @returns {*[]}
 * @constructor
 */
export function foodGroup(fct) {
  const uniqueGroup = []
  if (fct) {
    fct.forEach(function (elem) {
      if (!uniqueGroup.includes(elem.Group)) {
        uniqueGroup.push(elem.Group)
      }
    })
  }
  return uniqueGroup
}
