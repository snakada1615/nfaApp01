import { describe, expect, it } from '@jest/globals'
import { setTypeOfDeepObject } from '../plugins/helper'
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
    data: [
      {
        isSelected: true,
        mId: 'pong',
        omnReplaceDict: {
          //      id: "foo",
          text: {
            deepObj: {
              deepProp: [1, 2, '???', 3],
            },
          },
        },
      },
    ],
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
                deepProp: [1, 2, null, 3],
              },
            },
          },
        },
      ],
    })
  })

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

  it('sourceの型変換機能', () => {
    const res = setTypeOfDeepObject(src1, OBJECT_SCHEMA)
    console.log(res)
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
                deepProp: [1, 2, null, 3],
              },
            },
          },
        },
      ],
    })
  })
})
