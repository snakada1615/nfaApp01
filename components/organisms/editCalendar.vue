<template>
  <b-container>
    <b-card
      :header="headerText"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <!-- 現在のカレンダー名  -->
      <div class="mb-2 ml-3">
        current calendar:
        <span class="text-danger font-weight-bold">
          {{ calendarName }}
        </span>
      </div>

      <!-- 作物にフィルターをかける -->
      <b-input-group
        v-if="calendarContent.length"
        class="mb-1 mt-3"
        prepend="filter"
      >
        <b-form-input
          id="filterInput"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
        />
        <template #append>
          <b-input-group-text>Group</b-input-group-text>
          <b-form-select v-model="groupFilter" :options="FoodGrp" />
          <b-button variant="success" @click="groupFilter = ''">clear</b-button>
        </template>
      </b-input-group>

      <!-- カレンダーの表示 -->
      <b-table
        v-if="calendarContent.length"
        striped
        sticky-header
        :items="currentCalendarFiltered"
        :fields="fields"
        :filter="filter"
        :filter-included-fields="filterOn"
      >
        <!-- A custom formatted footer cell for field '1-12' -->
        <template
          v-for="month in [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ]"
          #[`cell(${month})`]="data"
        >
          <b-button
            class="px-0 py-0 mx-0 my-0"
            variant="light"
            @click="onCalendarClick(data)"
          >
            <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
              <b-icon
                v-if="data.value === 0"
                class="rounded"
                icon="check"
                variant="light"
              />
              <b-icon
                v-if="data.value === 1"
                class="rounded"
                icon="check"
                variant="light"
              />
              <b-icon
                v-if="data.value === 2"
                class="rounded"
                icon="check"
                variant="light"
              />
            </b-badge>
          </b-button>
        </template>
      </b-table>
    </b-card>
  </b-container>
</template>
<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
// import { fireGetDoc, getFileList } from '../../plugins/firebasePlugin'
// import { makeToast } from '../../plugins/helper'

export default {
  layout: 'defaultEth',
  props: {
    headerText: {
      type: String,
      default: 'Edit crop calendar',
    },
    calendarName: {
      type: String,
      default: 'defaultCalendar',
    },
    calendarContent: {
      type: Array,
      required: false,
      validator: arrayValidator({
        type: Object,
        required: true,
        validator: objectValidator({
          1: Number,
          2: Number,
          3: Number,
          4: Number,
          5: Number,
          6: Number,
          7: Number,
          8: Number,
          9: Number,
          10: Number,
          11: Number,
          12: Number,
          FCT_id: String,
          Group: String,
          cropName: String,
          id: String,
        }),
      }),
    },
  },
  data() {
    return {
      /**
       * cropList用のfilter by Group
       */
      groupFilter: '',
      /**
       * フィルターの内容
       */
      filter: null,
      /**
       * フィルター適用のスイッチ
       */
      filterOn: ['crop name'],
      /**
       * テーブルに表示するfieldの定義
       */
      fields: [
        { key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'cropName', sortable: true, thStyle: { width: '200px' } },
        { key: '1', sortable: false, thStyle: { width: '10px' }, label: 'Jan' },
        { key: '2', sortable: false, thStyle: { width: '10px' }, label: 'Feb' },
        { key: '3', sortable: false, thStyle: { width: '10px' }, label: 'Mar' },
        { key: '4', sortable: false, thStyle: { width: '10px' }, label: 'Apr' },
        { key: '5', sortable: false, thStyle: { width: '10px' }, label: 'May' },
        { key: '6', sortable: false, thStyle: { width: '10px' }, label: 'Jun' },
        { key: '7', sortable: false, thStyle: { width: '10px' }, label: 'Jul' },
        { key: '8', sortable: false, thStyle: { width: '10px' }, label: 'Aug' },
        { key: '9', sortable: false, thStyle: { width: '10px' }, label: 'Sep' },
        {
          key: '10',
          sortable: false,
          thStyle: { width: '10px' },
          label: 'Oct',
        },
        {
          key: '11',
          sortable: false,
          thStyle: { width: '10px' },
          label: 'Nov',
        },
        {
          key: '12',
          sortable: false,
          thStyle: { width: '10px' },
          label: 'Dec',
        },
      ],
    }
  },
  computed: {
    /**
     * FCTに含まれるFood Groupの一覧
     * @returns {*[]}
     * @constructor
     */
    FoodGrp() {
      const uniqueGroup = []
      const calendar = this.calendarContent
      if (calendar) {
        calendar.forEach(function (elem) {
          if (!uniqueGroup.includes(elem.Group)) {
            uniqueGroup.push(elem.Group)
          }
        })
      }
      return uniqueGroup
    },
    currentCalendarFiltered() {
      if (!this.groupFilter) {
        return this.calendarContent
      } else {
        return this.calendarContent.filter(
          (item) => item.Group === this.groupFilter
        )
      }
    },
  },
  methods: {
    setBadgeColor(val) {
      switch (val) {
        case 1:
          return 'info'
        case 2:
          return 'danger'
        default:
          return 'light'
      }
    },
    /**
     * 特定行の×ボタンをクリックした場合に、インクリメント
     * @param data
     */
    onCalendarClick(data) {
      let res = Number(data.value)
      res += 1
      if (res > 2) {
        res = 0
      }
      const vm = this
      // this.currentCalendar[data.index][data.field.key] = String(res)
      const returnCalendar = vm.currentCalendar.map((item) => {
        if (item.id === data.item.id) {
          item[data.field.key] = res
        }
        return item
      })
      vm.$emit('update:currentCalendar', returnCalendar)
    },
  },
}
</script>
