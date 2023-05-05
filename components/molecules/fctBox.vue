<template>
  <b-container class="my-0">
    <!--  フィルター用のリストボックス  -->
    <b-input-group size="sm">
      <b-form-input
        id="filterInput"
        v-model="filter"
        type="search"
        placeholder="Type to Search"
      ></b-form-input>

      <template #append>
        <b-dropdown text="Group" variant="primary" size="sm">
          <b-select v-model="filter" items="foodGroup" />
          <b-dropdown-item
            v-for="grpName in foodGroup"
            :key="grpName"
            :value="grpName"
            @click="filter = grpName"
            >{{ grpName }}
          </b-dropdown-item>
        </b-dropdown>
        <b-button variant="info" :disabled="!filter" @click="filter = ''"
          >clear</b-button
        >
      </template>
    </b-input-group>

    <!--  ここからFCTテーブル本体  -->
    <div class="mt-3">
      <b-table
        ref="table"
        class="jest_table"
        striped
        bordered
        border-variant="dark"
        responsive
        selectable
        select-mode="single"
        small
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        head-row-variant="success"
        v-bind="$attrs"
        @filtered="onFiltered"
        @row-clicked="rowClick"
        @row-dblclicked="rowDblClick"
        @input="onInput"
      >
        <template #cell(Name)="data">
          <b-icon
            icon="BIconPlusCircle"
            variant="danger"
            @click="clickPlus(data.item)"
          />
          {{ data.item.Name }}
        </template>
      </b-table>

      <!--   ページ毎の表示件数を選択   -->
      <b-input-group size="sm" prepend="Item per Page" class="mb-2">
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          size="sm"
          :options="pageOptions"
        ></b-form-select>
      </b-input-group>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
      ></b-pagination>
    </div>
  </b-container>
</template>

<script>
import { arrayValidator, objectValidator } from 'vue-props-validation'
import { foodGroup } from '@/plugins/helper'

/**
 * 食品成分表を表示し、必要な作物を選択する
 */
export default {
  name: 'FctBox',
  props: {
    /**
     * FCTの本体。Array of Object
     */
    items: {
      type: Array,
      required: true,
      validator: arrayValidator({
        type: Object,
        validator: objectValidator({
          Carbohydrate: Number,
          En: Number,
          Fe: Number,
          Fat: Number,
          Food_grp: String,
          Name: String,
          Pr: Number,
          Va: Number,
          Group: String,
          food_grp_id: String,
          id: String,
        }),
      }),
    },
  },
  data() {
    return {
      /**
       * テーブルに表示するfieldの定義
       */
      fields: [
        { key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Name', sortable: true, thStyle: { width: '290px' } },
        { key: 'En', sortable: true, thStyle: { width: '50px' } },
        { key: 'Pr', sortable: true, thStyle: { width: '50px' } },
        { key: 'Va', sortable: true, thStyle: { width: '50px' } },
        { key: 'Fe', sortable: true, thStyle: { width: '50px' } },
      ],
      /**
       * FCTの全ての行数
       */
      totalRows: 1,
      /**
       * 現在のページ番号
       */
      currentPage: 1,
      /**
       * 現在表示しているページ番号
       */
      perPage: 5,
      /**
       * 1ページ毎の表示行数
       */
      pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
      /**
       * 並べ替えの基準になる行
       */
      sortBy: 'Name',
      /**
       * 並べ替えの順序
       */
      sortDesc: false,
      /**
       * フィルターの内容
       */
      filter: null,
      /**
       * フィルター適用のスイッチ
       */
      filterOn: ['Group', 'Name'],
    }
  },
  computed: {
    /**
     * FCTに含まれるFood Groupの一覧
     * @returns {*[]}
     * @constructor
     */
    foodGroup() {
      return foodGroup(this.items)
    },
  },
  methods: {
    /**
     * フィルターをかけた際の表示行数、ページ数を調整する関数
     * @param filteredItems
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    /**
     * 入力されたキーワードに基づいたフィルターの作成
     */
    onInput() {
      // Set the initial number of items
      this.totalRows = this.items.length
    },
    /**
     * テーブルの行をクリックした際にその行の情報をemit
     * @event fctClick
     */
    rowClick(record) {
      this.$emit('fctClick', record)
    },
    clickPlus(val) {
      this.$emit('fctClickPlus', val)
    },
    /**
     * テーブルの行をダブルクリックした際にその行の情報をemit
     * @param record
     */
    rowDblClick(record) {
      this.$emit('fctDblClick', record)
    },
  },
}
</script>

<style scoped></style>
