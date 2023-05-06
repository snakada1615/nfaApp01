import { describe, expect, it } from '@jest/globals'
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
})
