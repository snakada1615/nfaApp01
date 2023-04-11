<template>
  <b-container class="my-0 px-0">
    <div>
      <b-table
        ref="table"
        striped
        bordered
        small
        :sticky-header="true"
        :no-border-collapse="true"
        :items="itemWeightedCompute"
        :fields="fields"
        foot-clone
        no-footer-sorting
        v-bind="$attrs"
        head-row-variant="success"
        @input="onItemChanged"
        @row-clicked="rowClick"
      >
        <!-- A custom formatted footer cell for field 'name' -->
        <template #head(foodName)>
          <span>Menu</span>
        </template>
        <template #foot(foodName)>
          <span />
        </template>
        <!-- A custom formatted footer cell for field 'name' -->
        <template #head(Name)>
          <span>ingredients</span>
        </template>
        <template #foot(Name)>
          <span>total</span>
        </template>
        <!-- A custom formatted footer cell for field 'En' -->
        <template #foot(En)>
          <span class="text-info" style="font-size: small">{{
            formatNumber(nutritionSumCompute.En, 0)
          }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Pr' -->
        <template #foot(Pr)>
          <span class="text-info" style="font-size: small">{{
            formatNumber(nutritionSumCompute.Pr, 1)
          }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Va' -->
        <template #foot(Va)>
          <span class="text-info" style="font-size: small">{{
            formatNumber(nutritionSumCompute.Va, 2)
          }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Fe' -->
        <template #foot(Fe)>
          <span class="text-info" style="font-size: small">{{
            formatNumber(nutritionSumCompute.Fe, 3)
          }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Wt' -->
        <template #foot(Wt)>
          <span class="text-info" style="font-size: small">{{
            formatNumber(nutritionSumCompute.Wt, 1)
          }}</span>
        </template>

        <!-- A custom formatted cell for field 'name' -->
        <template #cell(Name)="data">
          <span
            class="text-info pointer"
            style="font-size: small"
            @click="editItem(data.item)"
            ><u>{{ data.value }}</u></span
          >
          <b-icon
            icon="trash"
            variant="dark"
            font-scale="0.8"
            @click="delItem(data.index)"
          />
        </template>
        <!-- A custom formatted cell for field 'foodName' -->
        <template #cell(foodName)="data">
          <span style="font-size: small">
            <!-- 'new'と表記されている場合に「!」マークを表示-->
            <b-icon
              v-if="addExclamation(data.value)"
              icon="exclamation-circle"
              aria-hidden="true"
              class="text-danger"
            />
            {{ data.value }}
          </span>
        </template>
        <!-- A custom formatted cell for field 'En' -->
        <template #cell(En)="data">
          <span style="font-size: small">{{
            formatNumber(data.value, 0)
          }}</span>
        </template>
        <!-- A custom formatted cell for field 'Pr' -->
        <template #cell(Pr)="data">
          <span style="font-size: small">{{
            formatNumber(data.value, 1)
          }}</span>
        </template>
        <!-- A custom formatted cell for field 'Va' -->
        <template #cell(Va)="data">
          <span style="font-size: small">{{
            formatNumber(data.value, 2)
          }}</span>
        </template>
        <!-- A custom formatted cell for field 'Fe' -->
        <template #cell(Fe)="data">
          <span style="font-size: small">{{
            formatNumber(data.value, 3)
          }}</span>
        </template>
        <!-- A custom formatted cell for field 'Wt' -->
        <template #cell(Wt)="data">
          <span style="font-size: small">{{
            formatNumber(data.value, 1)
          }}</span>
        </template>
        <template #table-caption>
          <small>KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie</small>
        </template>
      </b-table>
    </div>
  </b-container>
</template>

<script>
import { setDigit } from '@/plugins/helper'

/**
 * - 選択された品目一覧を表示するテーブル
 * - 横幅がタブレット以上の場合には料理名を表示、スマホの場合は材料名のみ表示
 */
export default {
  props: {
    /**
     * 食品名及び栄養成分の一覧を含む配列
     */
    items: {
      type: Array,
      required: true,
    },
    dummyDrawFlag: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      /**
       * テーブルのフィールド毎の書式設定
       */
      fields: [
        { key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        {
          key: 'foodName',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        { key: 'Name', sortable: true },
        {
          key: 'Wt',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'En',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Pr',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Va',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'Fe',
          sortable: true,
          tdClass: 'text-center',
          thClass: 'text-center',
        },
      ],
    }
  },
  computed: {
    /**
     * itemの各要素にweightを掛け合わせたもの
     */
    itemWeightedCompute: {
      get() {
        if (this.items.length === 0) {
          return []
        }
        return this.updateItemWeight(this.items)
      },
    },
    /**
     * itemに含まれる全ての作物の栄養成分の合計値
     */
    nutritionSumCompute: {
      get() {
        if (this.itemWeightedCompute.length === 0) {
          return { En: 0, Pr: 0, Va: 0, Fe: 0, Wt: 0 }
        }
        return { ...this.updateSum(this.itemWeightedCompute) }
      },
    },
  },
  methods: {
    formatNumber(val, index) {
      return setDigit(Number(val), index)
    },
    addExclamation(val) {
      return val === 'new'
    },
    /**
     * itemの各要素の値から合計値を計算
     * @param val
     * @returns {*}
     */
    updateSum(val) {
      return val.reduce((accumulator, item) => {
        accumulator.En = (accumulator.En || 0) + Number(item.En ? item.En : 0)
        accumulator.Pr = (accumulator.Pr || 0) + Number(item.Pr ? item.Pr : 0)
        accumulator.Va = (accumulator.Va || 0) + Number(item.Va ? item.Va : 0)
        accumulator.Fe = (accumulator.Fe || 0) + Number(item.Fe ? item.Fe : 0)
        accumulator.Wt = (accumulator.Wt || 0) + Number(item.Wt ? item.Wt : 0)
        return accumulator
      }, {})
    },
    /**
     * itemの各要素の値に重量を掛け合わせる
     * @param item
     */
    updateItemWeight(item) {
      return item.map((val) => {
        return {
          foodName: val.foodName,
          Wt: val.Wt,
          id: val.cropInfo.id,
          Group: val.cropInfo.Group,
          Name: val.cropInfo.Name,
          En: (val.cropInfo.En * val.Wt) / 100,
          Pr: (val.cropInfo.Pr * val.Wt) / 100,
          Va: (val.cropInfo.Va * val.Wt) / 100,
          Fe: (val.cropInfo.Fe * val.Wt) / 100,
        }
      })
    },
    /**
     * itemの構成が変わるたびに、合計値をemit
     */
    onItemChanged() {
      this.$emit('totalChanged', this.nutritionSumCompute)
    },
    /**
     * fctテーブルの特定行がクリックされた場合、当該行の内容をemit
     * @param record
     */
    rowClick(record) {
      this.$emit('rowClick', record)
    },
    /**
     * 特定行の×ボタンをクリックした場合に、当該行を削除
     * @param id
     */
    delItem(id) {
      const res = this.items.filter((item, index) => index !== id)
      this.$emit('itemDeleted', res)
    },
    editItem(val) {
      this.$emit('itemEdit', val)
    },
  },
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
