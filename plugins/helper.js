// **************************************************************************
// ***** こちらは共通変数の定義 *************************************************
// **************************************************************************

/**
 * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
 * @returns {*[]}
 */
export function getDiversityStatus(menuCases, foodGroup) {
  const res = foodGroup.map((groupTemp) => {
    return { name: groupTemp, status: false }
  })
  if (menuCases !== []) {
    menuCases.forEach((foodsTemp) => {
      const indexTemp = foodGroup.indexOf(foodsTemp.cropInfo.Group)
      if (indexTemp >= 0) {
        res[indexTemp].status = true
      }
    })
    return res
  } else {
    return res
  }
}

/**
 * ターゲットグループの構成とdri一蘭から栄養需要を計算する
 * @param target ターゲット構成[id, count]
 * @param dri
 * @returns {*}
 */
export function getNutritionDemand(target, dri) {
  const initObj = {
    En: 0,
    Pr: 0,
    Va: 0,
    Fe: 0,
  }
  if (!target || target.length === 0) {
    return initObj
  }
  return target.reduce((accumulator, currentItem) => {
    const count = Number(currentItem.count)
    const driValue = dri.find((item) => item.id === currentItem.id)
    if (!driValue) {
      throw new Error('targetMember not matching...')
    }
    accumulator.En += count * Number(driValue.En)
    accumulator.Pr += count * Number(driValue.Pr)
    accumulator.Va += count * Number(driValue.Va)
    accumulator.Fe += count * Number(driValue.Fe)
    return accumulator
  }, initObj)
}

/**
 * 選択された作物一蘭から栄養供給量を計算
 * @param datArray (type: recipe)
 * @param stapleCheck
 * @returns {*}
 */
export function getNutritionSupply(datArray, stapleCheck = 0) {
  return datArray.reduce(
    (accumulator, item) => {
      // Pr, Fe, Fatについて、別変数を用意
      let myPr = item.cropInfo.Pr ? Number(item.cropInfo.Pr) : 0
      let myFe = item.cropInfo.Fe ? Number(item.cropInfo.Fe) : 0
      let myFat = item.cropInfo.Fat ? Number(item.cropInfo.Fat) : 0

      // stapleCheck=1, かつ食品群がstapleであった場合、Pr、Fe の値を無視
      if (stapleCheck === 1 && item.cropInfo.food_grp_id === '1') {
        myPr = 0
        myFe = 0
        myFat = 0
      }

      // En, Va, Carbohydrate, Wtについて、別変数を用意
      const En = item.cropInfo.En ? Number(item.cropInfo.En) : 0
      const Va = item.cropInfo.Va ? Number(item.cropInfo.Va) : 0
      const Carbohydrate = item.cropInfo.Carbohydrate
        ? Number(item.cropInfo.Carbohydrate)
        : 0
      const Wt = Number(item.Wt)

      accumulator.En += (En * Wt) / 100
      accumulator.Pr += (myPr * Wt) / 100
      accumulator.Va += (Va * Wt) / 100
      accumulator.Fe += (myFe * Wt) / 100
      accumulator.Carbohydrate += (Carbohydrate * Wt) / 100
      accumulator.Fat += (myFat * Wt) / 100
      accumulator.Wt += Wt
      return accumulator
    },
    {
      En: 0,
      Pr: 0,
      Va: 0,
      Fe: 0,
      Wt: 0,
      Carbohydrate: 0,
      Fat: 0,
    }
  )
}

/**
 * 栄養需要と栄養供給から、栄養素ごとのギャップ判定
 * @param supply
 * @param demand
 * @returns {{}}
 */
export function getNutritionGap(supply, demand) {
  const gap = {}
  Object.entries(demand).forEach(([key, value]) => {
    gap[key] = value - supply[key]
  })
  return gap
}

/**
 * 数字の桁数を３桁に自動調整し、単位を追記して返す
 * unitkey [0..3]
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
