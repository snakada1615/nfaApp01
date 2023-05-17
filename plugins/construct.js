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

export class FeasibilityCases extends ResponsiveArray {
  add(data) {
    super.add({
      familyMember: data.dri.map(function (item) {
        return { id: item.id, count: 0 }
      }),
      selectedCrop: new CropInfo(data.cropInfo),
      note: data.note,
      prodTarget: {
        Wt: Number,
        Wt365: Number,
        share: Number,
      },
      ansList: [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99],
      familyId: data.familyId,
      month: data.month,
      caseId: data.caseId || data.selectedCrop.Name + '_' + data.month,
    })
  }
}

export class Recipe extends ResponsiveArray {
  add(data) {
    const recipeId = data.recipeId || data.cropInfo.Name + '_' + data.foodName

    const dataSet = {
      cropInfo: new CropInfo(data.cropInfo),
      Wt: data.Wt,
      foodName: data.foodName,
      recipeId,
    }

    const index = this.findIndex((item) => {
      return item.recipeId === recipeId
    })

    if (index) {
      super.replace(index, dataSet)
    } else {
      super.add(dataSet)
    }
  }
}

export class RecipeCases extends ResponsiveArray {
  add(data) {
    super.add({
      recipe: new Recipe(data.recipe),
      familyId: data.familyId,
      date: data.date,
      caseId: data.caseId,
    })
  }
}

export class PriorityCommodities extends ResponsiveArray {
  init(size) {
    for (let i = 0; i < size - 1; i++) {
      super.add({ month: '0', index: -1, selectedCrop: {} })
    }
  }
}

export class CropCalendar extends ResponsiveArray {
  init(data) {
    data.forEach((item) => {
      super.add({
        1: '0',
        2: '0',
        3: '0',
        4: '0',
        5: '0',
        6: '0',
        7: '0',
        8: '0',
        9: '0',
        10: '0',
        11: '0',
        12: '0',
        FCT_id: data.FCT_id,
        Group: data.Group,
        Name: data.Name,
        id: data.id,
      })
    })
  }
}
