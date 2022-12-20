import { describe, expect, it } from '@jest/globals'
import {
  initObject,
  setTypeOfDeepObject,
  validateDeepObject,
} from '../plugins/helper'
import { updateDeepObject } from '@/plugins/helper'

describe('updateDeepObject', () => {
  const OBJECT_SCHEMA = {
    name: String,
    data: [
      {
        isSelected: Boolean,
        mId: String,
        omnReplaceDict: {
          id: String,
          text: {
            deepObj: {
              deepProp: [Number],
            },
          },
        },
      },
    ],
  }

  const SingleFamilySchema = {
    name: String,
    member: [
      {
        id: String,
        count: Number,
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

  const src1 = {
    name: 'source1',
    data: [
      {
        isSelected: true,
        mId: 'pong',
        omnReplaceDict: {
          id: 'foo',
          text: {
            deepObj: {
              deepProp: [1, 2, '???', 3],
            },
          },
        },
      },
    ],
  }

  const src2noName = {
    data: [
      {
        isSelected: true,
        mId: 'pong',
        omnReplaceDict: {
          text: {
            deepObj: {
              deepProp: [1, 2, '???', 3],
            },
          },
        },
      },
    ],
  }

  const src3noArray = {
    name: 'source1',
    data: [
      {
        isSelected: true,
        mId: 'pong',
        omnReplaceDict: {
          id: 'pengo',
          text: {
            deepObj: {},
          },
        },
      },
    ],
  }

  const dest1 = {
    name: 'dest1Name',
    data: [
      {
        omnReplaceDict: {
          id: 'dest3',
        },
      },
    ],
  }

  const dest2 = {
    name: 'dest2Name',
    data: [],
  }

  const dest3 = {
    name: 'dest1Name',
    data: [
      {
        omnReplaceDict: {
          id: 'dest1',
        },
      },
    ],
  }

  const dest4 = {}

  const dest5 = {
    name: 'fun',
    member: [
      {
        id: 123,
        count: 5,
      },
    ],
  }

  it('sourceの構造が完全である場合', () => {
    const res = updateDeepObject(src1, dest1, OBJECT_SCHEMA)
    expect(res).toEqual({
      name: 'source1',
      data: [
        {
          isSelected: true,
          mId: 'pong',
          omnReplaceDict: {
            id: 'foo',
            text: {
              deepObj: {
                deepProp: [1, 2, NaN, 3],
              },
            },
          },
        },
      ],
    })
  })

  it('validateDeepObjについて1', () => {
    validateDeepObject(dest2, OBJECT_SCHEMA)
    expect(1).toEqual(1)
  })

  /*
  it('sourceの一部がかけている場合', () => {
    const res2 = updateDeepObject(src2noName, dest3, OBJECT_SCHEMA)
    console.log(res2)
    expect(res2).toEqual({
      name: 'dest1Name',
      data: [
        {
          isSelected: true,
          mId: 'pong',
          omnReplaceDict: {
            id: 'dest1',
            text: {
              deepObj: {
                deepProp: [1, 2, null, 3],
              },
            },
          },
        },
      ],
    })
  })
*/

  it('sourceの型変換機能', () => {
    const res = setTypeOfDeepObject(src1, OBJECT_SCHEMA)
    expect(res).toEqual({
      name: 'source1',
      data: [
        {
          isSelected: true,
          mId: 'pong',
          omnReplaceDict: {
            id: 'foo',
            text: {
              deepObj: {
                deepProp: [1, 2, NaN, 3],
              },
            },
          },
        },
      ],
    })
  })

  it('sourceの型変換機能：初期値指定なし', () => {
    const res = initObject(dest4, SingleFamilySchema)
    expect(res).toEqual({
      name: '0',
      member: [],
      diet: [],
      recommendedCrops: [],
    })
  })

  it('sourceの型変換機能：一部初期値指定', () => {
    const res = initObject(dest5, SingleFamilySchema)
    expect(res).toEqual({
      name: 'fun',
      member: [{ id: '123', count: 5 }],
      diet: [],
      recommendedCrops: [],
    })
  })
})
