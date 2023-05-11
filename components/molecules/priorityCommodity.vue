<template>
  <b-container>
    <b-card
      style="min-width: 530px;"
      header-bg-variant="success"
      bg-variant="light"
      border-variant="success"
      class="mx-1 px-0 my-2"
    >
      <template #header>
        <div>Select key nutrient for your target family/HH</div>
      </template>
      <b-row>
        <b-col>
          <b-form-group
            class="ml-2"
          >
            <b-form-radio-group
              v-model="selectedNutrientComputed"
              :options="nutrientOptions"
              button-variant="outline-primary"
              buttons
              stacked
              class="ml-4"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <div>Month</div>
          <b-form-select
            v-model="selectedMonthComputed"
            :options="monthOptions"
          />
        </b-col>
      </b-row>
    </b-card>
    <b-card
      style="min-width: 530px;"
      header-bg-variant="success"
      bg-variant="light"
      border-variant="success"
      class="mx-1 px-0 my-2"
    >
      <template #header>
        <div>Selected Commodities</div>
      </template>
      <div v-if="cropListByMonth">
        please select candidate commodities first
      </div>

      <b-list-group>
        <b-list-group-item
          v-for="(crop, index) in cropListByMonth"
          :key="index"
        >
          <div class="d-flex justify-content-between">
            <span>{{ crop }}</span>
            <span>
              <b-button
                :disabled="!selectedNutrientComputed || !selectedMonthComputed"
                size="sm"
                variant="info"
                @click="showFctDialogue(index)"
              >select</b-button>
            </span>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <fct-table-modal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="fctFilterByMonth"
      @modalOk="onCropSelected($event, {index: addCropId, month: selectedMonthComputed})"
    />
  </b-container>
</template>

<script>
import fctTableModal from '@/components/organisms/FctTableModal'

export default {
  name: 'PriorityCommodity',
  components: {
    fctTableModal
  },
  props: {
    selectedMonth: {
      type: Number,
      required: true
    },
    selectedNutrient: {
      type: String,
      required: true
    },
    fct: {
      type: Array,
      required: true
    },
    cropCalendar: {
      type: Array,
      required: true
    },
    cropList: {
      type: Array,
      required: true
    },
    monthOptions: {
      type: Array,
      default: () => {
        return [
          { value: 1, text: 'Jan' },
          { value: 2, text: 'Feb' },
          { value: 3, text: 'Mar' },
          { value: 4, text: 'Apr' },
          { value: 5, text: 'May' },
          { value: 6, text: 'Jun' },
          { value: 7, text: 'Jul' },
          { value: 8, text: 'Aug' },
          { value: 9, text: 'Sep' },
          { value: 10, text: 'Oct' },
          { value: 11, text: 'Nov' },
          { value: 12, text: 'Dec' }
        ]
      }
    },
    nutrientOptions: {
      type: Array,
      default: () => {
        return [
          { text: 'Energy', value: 'En' },
          { text: 'Protein', value: 'Pr' },
          { text: 'Vitamin A', value: 'Va' },
          { text: 'Iron', value: 'Fe' }
        ]
      }
    }
  },
  data () {
    return {
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
      /**
       * 現在入力中の作物リストのid
       */
      addCropId: -1
    }
  },
  computed: {
    cropListByMonth: {
      get () {
        const vm = this
        if (vm.selectedMonthComputed === -1) {
          return []
        }
        return vm.cropList.filter(item => item.month === vm.selectedMonthComputed).map((item2) => {
          return Object.keys(item2.selectedCrop).length ? item2.selectedCrop.Name : ''
        })
      }
    },
    fctFilterByMonth () {
      if (this.selectedMonthComputed === -1) {
        return JSON.parse(JSON.stringify(this.fct))
      }
      const filteredId = this.cropCalendar.filter(item =>
        (item[this.selectedMonthComputed] === '1') || (item[this.selectedMonthComputed] === '2')).map((item2) => {
        return item2.FCT_id
      })
      return this.fct.filter(item => filteredId.includes(item.id))
    },
    selectedNutrientComputed: {
      get () {
        return this.selectedNutrient
      },
      set (val) {
        this.$emit('update:selectedNutrient', val)
      }
    },
    selectedMonthComputed: {
      get () {
        return this.selectedMonth
      },
      set (val) {
        this.$emit('update:selectedMonth', val)
      }
    }
  },
  methods: {
    /**
     * fctダイアログのトリガー
     */
    showFctDialogue (index) {
      if (this.fctFilterByMonth.length === 0) {
        alert('there is no available crop for this month')
        return
      }
      this.addCropId = index
      this.showFct = !this.showFct
    },
    /**
     * cropの選択した値をもとにデータ更新
     * @param val
     * @param options
     */
    onCropSelected (val, options) {
      // 選択された作物の重量を100gにセット
      val.Wt = 100
      // cropList全体を更新する場合
      const returnValue = this.cropList.map((item) => {
        if ((item.month === options.month) && (item.index === options.index)) {
          return {
            month: item.month,
            index: item.index,
            selectedCrop: JSON.parse(JSON.stringify(val))
          }
        } else {
          return item
        }
      })
      this.$emit('update:cropList', returnValue)
      this.$emit('changeCrop', {
        month: options.month,
        index: options.index,
        selectedCrop: val
      })
    }
  }
}
</script>
