<template>
  <b-container>
    <b-modal
      id="modalSave"
      v-model="showModalComp"
      header-bg-variant="Primary"
      title="save to"
      hide-header-close="true"
      no-close-on-esc
      static
      @hidden="resetModal"
      @show="initModal"
      @ok="saveDocument"
    >
      <!--  既存のdocument一覧  -->
      <b-input-group size="sm" prepend="file name">
        <b-form-input
          id="filterInput"
          v-model="currentDoc"
          type="search"
        ></b-form-input>

        <template #append>
          <b-dropdown
            v-if="docList.length > 0"
            text="select"
            variant="primary"
            size="sm"
          >
            <b-dropdown-item
              v-for="grpName in docList"
              :key="grpName"
              :value="grpName"
              @click="currentDoc = grpName"
              >{{ grpName }}
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-input-group>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  name: 'FileAccess',
  props: {
    /**
     * modal表示用フラグ
     */
    showModal: {
      type: Boolean,
      required: true,
    },
    /**
     * 保存先のcollection名
     */
    collection: {
      type: String,
      required: true,
    },
    docId: {
      type: String,
      default: '',
    },
    /**
     * 保存するdataset(Array)
     */
    docArray: {
      type: Array,
      required: true,
    },
    /**
     * JSON変換時のキーフィールド
     */
    docKeyField: {
      type: String,
      default: '',
    },
    /**
     * 更新時にmergeするか上書きするか
     */
    mergeFlag: {
      type: Boolean,
      default: true,
    },
    /**
     * documentの一覧
     */
    docList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentDoc: '',
    }
  },
  computed: {
    docJson() {
      const vm = this
      const res = {}
      vm.docArray.forEach((item, index) => {
        const key = vm.docKeyField ? item[vm.docKeyField] : String(index)
        vm.$set(res, key, item)
      })
      return res
    },
    showModalComp: {
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      },
    },
  },
  methods: {
    saveDocument() {
      const found = this.docList.find((item) => {
        return item === this.currentDoc
      })
      if (found) {
        const res = window.confirm(
          'this will overwrite existing document( ' + this.currentDoc + '), ok?'
        )
        if (!res) {
          return
        }
      }
      console.log(this.currentDoc + ':' + this.collection)
    },
    resetModal() {
      this.currentDoc = ''
    },
    initModal() {
      this.currentDoc = this.docId
    },
  },
}
</script>

<style scoped></style>
