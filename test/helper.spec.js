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

  const obj1 = {
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

  const obj3 = {
    name: 'test',
    data: {
      isSelected: true,
      mId: 'bar',
      omnReplaceDict: {
        //      id: "foo",
        text: {
          deepObj: {
            deepProp: [1, 2, '???', 3],
          },
        },
      },
    },
  }

  const obj2 = {
    name: 'bar',
  }

  it('replace obj2 with obj1 with type specified in schema (OBJECT_SCHEMA),', () => {
    updateDeepObject(obj1, obj2, OBJECT_SCHEMA)
    console.log('done1')
    console.log(obj2)
    //    expect(obj2).toBe(obj1)

    updateDeepObject(obj3, obj2, OBJECT_SCHEMA)
    console.log('done2')
    console.log(obj2)
    //    expect(obj2).toBe(obj1)
  })
})
