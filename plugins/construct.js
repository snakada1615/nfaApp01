export class ResponsiveArray extends Array {
  add(data) {
    const p = data
    this.push(data)
    return p
  }

  addAll(data) {
    data.forEach((item) => {
      this.add(item)
    })
  }

  replace(index, data) {
    this.splice(index, 1, data)
  }

  replaceAll(data) {
    this.splice(0, this.length, data)
  }

  delete(index) {
    this.splice(index, 1)
  }

  deleteAll() {
    this.splice(0, this.length)
  }
}

/**
 *
 * @type {CropInfo}
 */
export class CropInfo {
  constructor(data) {
    // console.log(data)
    this.Carbohydrate = data.Carbohydrate || 0
    this.En = data.En || 0
    this.Fe = data.Fe || 0
    this.Fat = data.Fat || 0
    this.Pr = data.Pr || 0
    this.Va = data.Va || 0
    this.Food_grp = data.Food_grp
    this.Name = data.Name
    this.Group = data.Group
    this.food_grp_id = data.food_grp_id
    this.id = data.id
  }
}

export class RecipeItem {
  constructor(data) {
    this.cropInfo = new CropInfo(data.cropInfo)
    this.Wt = data.Wt
    this.foodName = data.foodName
  }
}

export class FeasibilityCase {
  constructor(data) {
    this.target = data.dri.map(function (item) {
      return { id: item.id, count: 0 }
    })
    this.selectedCrop = new CropInfo(data.cropInfo)
    this.note = ''
    this.ansList = [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99]
  }
}

export class FeasibilityCases extends ResponsiveArray {
  add(data) {
    const p = new FeasibilityCase(data)
    super.add(p)
  }
}

export class Recipe extends ResponsiveArray {
  add(data) {
    const p = new RecipeItem(data)
    super.add(p)
  }
}

export class RecipeCases extends ResponsiveArray {
  init(payload) {
    for (let i = 0; i < payload.count; i++) {
      const isTargetSingle = true
      const note = ''
      const recipe = []
      const target = payload.data.map(function (dat) {
        return { id: dat.id, count: 0 }
      })
      super.add({ target, recipe, note, isTargetSingle })
    }
  }
}
