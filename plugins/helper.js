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
 * Validator for complex object
 * ネストしたObjectに必要なKeyが含まれているかを検証
 * @param data 検査対象のObject
 *     （例：
 *         const obj = {
 *             "type":"typeName","firstName":"Steven",
 *             "lastName":"Smith","address":{"primary":{"city":"abc",
 *             "street":{"name":{"subName":"someName"}}}}
 *                 };）
 * @param types validaterを指定（必要なkeyを配列で指定する
 *     例：const typeName = ['firstName', 'lastName', 'address', '
 *     address.primary', 'address.primary.city',
 *     'address.primary.street'];
 *     ）
 * @returns {*[]} dataに存在しないkeyを抽出
 */
export function validateObject(data, types) {
  const errors = []
  types.forEach((type) => {
    const keys = type.split('.')
    let datum = {
      ...data,
    }
    // Loop through the keys
    for (const [index, key] of keys.entries()) {
      // Check if the key is not available in the data
      // then push the corresponding key to the errors array
      // and break the loop
      // 以下の行を、if (!datum[key]) { とすればkeyの存在＋値の有無をチェックする
      if (datum[key] === undefined) {
        errors.push(keys.slice(0, index + 1).join('.'))
        break
      }
      datum = datum[key]
    }
  })
  return errors
}

/**
 * nested Objectの型チェック
 * @param obj チェックするターゲット
 * @param schema 型定義のためのスキーマ
 * @param path どこで問題があったかを示す
 * @returns {boolean}
 */
export function validateDeepObject(obj, schema, path = '') {
  let ok = true

  if (!obj) ok = obj === schema
  else if (typeof schema === 'function') ok = obj.constructor === schema
  else if (typeof obj !== 'object') ok = obj === schema
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
  if (!ok) throw new TypeError('Wrong parameter in' + path)
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
      res = String(Math.round(item)) + units[unitKey - 1]['1']
      break
    case item >= 1000 && item < 1000000:
      res = String(Math.round(item / 1000)) + units[unitKey - 1]['2']
      break
    case item >= 1000000:
      res = String(Math.round(item / 1000000)) + units[unitKey - 1]['3']
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
