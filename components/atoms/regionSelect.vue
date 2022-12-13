<template>
  <b-container>
    <div v-if="regionObj">
      <!-- region1の選択     -->
      <b-input-group size="sm" class="my-1">
        <b-input-group-prepend>
          <b-input-group-text>{{ label1 }}</b-input-group-text>
        </b-input-group-prepend>
        <b-form-select
          v-if="regionObj"
          :value="key1Temp"
          :options="regions1"
          @change="$emit('update:key1', $event)"
        />
      </b-input-group>

      <!-- region2の選択     -->
      <b-input-group size="sm" class="my-1">
        <b-input-group-prepend>
          <b-input-group-text>{{ label2 }}</b-input-group-text>
        </b-input-group-prepend>
        <b-form-select
          v-if="regionObj"
          :value="key2Temp"
          :options="regions2"
          @change="$emit('update:key2', $event)"
        />
      </b-input-group>

      <!-- region3の選択     -->
      <b-input-group size="sm" class="my-1">
        <b-input-group-prepend>
          <b-input-group-text>{{ label3 }}</b-input-group-text>
        </b-input-group-prepend>
        <b-form-select
          v-if="regionObj"
          :value="key3Temp"
          :options="regions3"
          @change="$emit('update:key3', $event)"
        />
      </b-input-group>
    </div>
  </b-container>
</template>

<script>
/**
 * @desc storeからregion一覧を読み込んでリストボックスで選択し、プロパティとして値を返す
 *
 */
export default {
  props: {
    /**
     * regionの一覧
     */
    regionList: {
      type: Array,
      default: () => [],
    },
    /**
     * 選択された地域1
     */
    key1: {
      type: String,
      required: true,
      default: '',
    },
    /**
     * 選択された地域2
     */
    key2: {
      type: String,
      required: true,
      default: '',
    },
    /**
     * 選択された地域3
     */
    key3: {
      type: String,
      required: true,
      default: '',
    },
    /**
     * region1のラベル
     */
    label1: {
      type: String,
      default: 'Region',
    },
    /**
     * region2のラベル
     */
    label2: {
      type: String,
      default: 'Zone',
    },
    /**
     * region3のラベル
     */
    label3: {
      type: String,
      default: 'Woreda',
    },
  },
  data() {
    return {
      /**
       * fireStoreから読み込んだデータ本体
       */
      dataCsv: '',
      /**
       * 初回読み込み時のRegion2用のフラグ
       */
      initialFlagRegion2: true,
      /**
       * 初回読み込み時のRegion3用のフラグ
       */
      initialFlagRegion3: true,
    }
  },
  /**
   * 起動時にfireStoreからRegionデータ読み込み
   * @returns {Promise<void>}
   */
  async fetch() {
    this.dataCsv = await this.$store.dispatch('fire/initRegion')
  },
  computed: {
    /**
     * dataCsvを配列に変換(Object -> Array of Object)
     * @returns {*}
     */
    regionObj() {
      if (this.dataCsv.length === 0) {
        return
      }
      return Object.values(this.dataCsv).reduce((accum, item) => {
        const index1 = Object.keys(accum).indexOf(item.region1)
        if (index1 === -1) {
          accum[item.region1] = { [item.region2]: new Array(item.region3) }
        } else {
          const index2 = Object.keys(accum[item.region1]).indexOf(item.region2)
          if (index2 === -1) {
            accum[item.region1][item.region2] = new Array(item.region3)
          } else {
            accum[item.region1][item.region2].push(item.region3)
          }
        }
        return accum
      }, [])
    },
    /**
     * Regionの最上位の階層リスト（b-form-selectで使う）
     * @returns {string[]|*[]}
     */
    regions1() {
      const res = Object.keys(this.regionObj)
      return res || []
    },
    /**
     * Regionの2番目の階層（b-form-selectで使う）
     *     プロパティkey2, key3の変更はemitで通知
     * @returns {*[]|string[]}
     */
    regions2() {
      if (!this.key1Temp) {
        return []
      }
      // key1の値に対応してregion2を更新
      const res = Object.keys(this.regionObj[this.key1Temp])

      // key2が[region2]に含まれない値の場合、key2, key3を初期化する
      if (!res.includes(this.key2)) {
        this.$emit('update:key2', '')
        this.$emit('update:key3', '')
      }
      return res || []
    },

    /**
     * Regionの3番目の階層（b-form-selectで使う）
     *     プロパティkey2, key3の変更はemitで通知
     * @returns {*|*[]}
     */
    regions3() {
      if (!this.key1Temp) {
        return []
      }
      if (!this.key2Temp) {
        return []
      }

      // key2の値に対応してregion3を更新
      const res = this.regionObj[this.key1Temp][this.key2Temp]

      // key2が[region2]に含まれない値の場合、key2, key3を初期化する
      if (!res) {
        this.$emit('update:key2', '')
        this.$emit('update:key3', '')
      } else if (!res.indexOf(this.key3)) {
        // key3が[region3]に含まれない値の場合、key3を初期化する
        this.$emit('update:key3', '')
      }
      return res || []
    },

    /**
     * プロパティの代替変数
     * @returns {string}
     */
    key1Temp() {
      return this.key1
    },
    /**
     * プロパティの代替変数
     * @returns {string}
     */
    key2Temp() {
      return this.key2
    },
    /**
     * プロパティの代替変数
     * @returns {string}
     */
    key3Temp() {
      return this.key3
    },
  },
  methods: {},
}
</script>
