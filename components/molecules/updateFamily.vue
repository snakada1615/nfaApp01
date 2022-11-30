<template>
  <b-container>
    <!-- メンバー登録用table -->
    <b-table
      small
      stripped
      responsive
      :items="familyMember"
      :fields="fieldMember"
    >
      <template #cell(number)="data">
        <div class="d-flex justify-content-around align-items-center">
          <b-icon
            icon="BIconPlusCircleFill"
            class="mx-2"
            style="cursor: pointer"
            scale="1.5"
            @click="updateMemberPlusOne(data.item.id)"
          />
          <b-form-input
            :value="data.item.number"
            type="number"
            size="sm"
            class="d-flex justify-content-center"
            @input="updateMember(data.item.id, $event)"
          />
          <b-icon
            icon="BIconDashCircleFill"
            class="mx-2"
            style="cursor: pointer"
            scale="1.5"
            @click="updateMemberMinusOne(data.item.id)"
          />
        </div>
      </template>
    </b-table>

    <!-- 栄養必要量合計表示用table -->
    <!--  このテーブルは栄養必要量の合計  -->
    <b-table
      class="jest_table"
      striped
      bordered
      small
      :fixed="true"
      head-row-variant="success"
      table-variant="light"
      :items="familyDri"
      :fields="fieldDRI"
    >
      <template #cell(Value)="data">
        <span class="text-info">{{ data }}</span>
      </template>
      <template #table-caption>
        KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
      </template>
    </b-table>
  </b-container>
</template>

<script>
import { makeToast, nutritionDemands, setDigit } from '@/plugins/helper'

export default {
  name: 'MyTest02',
  props: {
    dri: {
      type: Object,
      required: true,
    },
    member: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      /**
       * 表示用のフィールド定義
       */
      fieldDRI: [
        { key: 'name', sortable: false },
        { key: 'value', sortable: false },
      ],
      /**
       * sortのためのkey列を定義
       */
      sortBy: 'id',
      /**
       * 栄養必要量の合計値を示すテーブルのフィールド定義
       */
      fieldMember: [
        { key: 'name', sortable: false },
        { key: 'number', sortable: false },
      ],
    }
  },
  computed: {
    familyMember: {
      get() {
        return this.member
      },
      set(val) {
        console.log(val)
      },
    },
    familySizes: {
      get() {
        return this.familyMember
      },
    },
    familyDri: {
      get() {
        return this.formatDriTable(
          nutritionDemands(this.dri, this.member, undefined, 2)
        )
      },
    },
  },
  created() {
    this.driTemp = this.dri
  },
  methods: {
    updateMember(id, number) {
      const tmpResult = JSON.parse(JSON.stringify(this.member)).map((item) => {
        if (item.id === id) {
          item.number = number
        }
        return item
      })
      this.$emit('update:member', tmpResult)
      makeToast(this, 'happy')
    },
    updateMemberPlusOne(id) {
      const tmpResult = JSON.parse(JSON.stringify(this.member)).map((item) => {
        if (item.id === id) {
          item.number += 1
        }
        return item
      })
      this.$emit('update:member', tmpResult)
    },
    updateMemberMinusOne(id) {
      const tmpResult = JSON.parse(JSON.stringify(this.member)).map((item) => {
        if (item.id === id && item.number > 0) {
          item.number -= 1
        }
        return item
      })
      this.$emit('update:member', tmpResult)
    },
    /**
     * 栄養必要量のテーブル表示用フォーマット
     * @param arr
     */
    formatDriTable(arr) {
      if (!arr) {
        return []
      }
      return arr.map((item) => {
        let index = 0
        const myKey = item.name
        if (['En'].includes(myKey)) {
          index = 0
        } else if (['Pr'].includes(myKey)) {
          index = 1
        } else if (['Va'].includes(myKey)) {
          index = 2
        } else if (['Fe'].includes(myKey)) {
          index = 3
        }
        const myValue = setDigit(item.value, index)
        return {
          name: myKey,
          value: myValue,
        }
      })
    },
  },
}
</script>

<style scoped></style>
