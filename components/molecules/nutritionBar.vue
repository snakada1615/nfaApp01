<template>
  <b-container class="my-0">
    <b-row class="my-0" align-v="center">
      <b-col :cols="colWidthFirst" class="px-0 d-flex justify-content-center">
        <div>{{ label }}</div>
      </b-col>
      <b-col :cols="colWidthSecond" class="px-0 d-flex justify-content-center">
        <div v-show="showMaxNumber">{{ maxRatingAbsoluteComputed }}</div>
      </b-col>
      <b-col :cols="colWidthThird" class="px-0 d-flex justify-content-center">
        <fa-rating
          v-model="rating"
          :glyph="myicon"
          :item-size="20"
          :spacing="-5"
          :border-width="0"
          active-color="#FF3333"
          inactive-color="#cfcfcf"
          :increment="increment"
          :max-rating="maxRating"
          :read-only="true"
          :show-rating="false"
        >
        </fa-rating>
        <div v-show="showReset" class="mx-2">
          <a href="#" @click.prevent="rating = 0">Reset</a>
        </div>
      </b-col>
      <b-col :cols="colWidthFourth" class="px-0 d-flex justify-content-start">
        <div :class="myTextColor">{{ rating }}</div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { FaRating } from 'vue-rate-it'
import stop from 'vue-rate-it/glyphs/stop'
import navicon from 'vue-rate-it/glyphs/navicon'

/**
 * - 与えられた値をもとにレーティングを横棒グラフで示す
 */
export default {
  components: {
    FaRating,
  },
  props: {
    /**
     * show reset button
     * データを０に戻すためのフラグ
     */
    showReset: {
      type: Boolean,
      default: false,
    },
    /**
     * show number next to barchart
     * 最大値を表示するかどうかのフラグ
     */
    showMaxNumber: {
      type: Boolean,
      default: true,
    },
    /**
     * actual score shown on barchart (relative value between [0, max])
     * ratingのための相対値
     */
    rating: {
      type: Number,
      default: 5,
      required: true,
    },
    /**
     * max value of barchart (relative value)
     * ratingの最大値(表示用のアイコンの個数なので、横棒にする場合は
     *     特に意味はない=10に固定する)
     */
    maxRating: {
      type: Number,
      default: 10,
    },
    /**
     * increment shown on the barchart
     * グラフの最小目盛幅(初期値のままで基本的にはok)
     */
    increment: {
      type: Number,
      default: 0.1,
    },
    /**
     * label shown at left side of barchart
     * 表示名
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * absolute value equivalent to max
     * ratingの最大値(実数)を表示する
     */
    maxRatingAbsolute: {
      type: Number,
      default: 0,
    },
    /**
     * maxRatingAbsoluteの桁数設定
     *     10の倍数（1,10,100,0.1,0.01,0.001）で指定
     */
    digitMaxRatingAbsolute: {
      type: Number,
      default: 1,
    },
    /**
     * labelを表示するための列幅
     */
    colWidthFirst: {
      type: Number,
      default: 3,
    },
    /**
     * maxRatingAbsoluteを表示するための列幅
     */
    colWidthSecond: {
      type: Number,
      default: 2,
    },
    /**
     * maxRatingAbsoluteを表示するための列幅
     */
    colWidthThird: {
      type: Number,
      default: 5,
    },
    /**
     * maxRatingAbsoluteを表示するための列幅
     */
    colWidthFourth: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      myicon: '', // declare the icon
    }
  },
  computed: {
    maxRatingAbsoluteComputed() {
      return this.orgRound(this.maxRatingAbsolute, this.digitMaxRatingAbsolute)
    },
    /**
     * ratingの値に応じて色を変化させる
     */
    myTextColor() {
      if (Number(this.rating) >= 7) {
        return 'text-success'
      } else if (Number(this.rating) >= 5) {
        return 'text-warning'
      } else {
        return 'text-danger'
      }
    },
  },
  created() {
    this.myicon = stop
  },
  methods: {
    /**
     * 任意の桁で四捨五入する関数
     * @param {number} value 四捨五入する数値
     * @param {number} base どの桁で四捨五入するか（10→10の位、0.1→小数第１位）
     * @return {number} 四捨五入した値
     */
    orgRound(value, base) {
      return Math.round(value * base) / base
    },
    /**
     * rating表示用のアイコンの設定
     * @param index
     */
    setIcon(index) {
      switch (index) {
        case 1:
          this.myicon = navicon
          break
        case 2:
          this.myicon = apple
          break
        case 3:
          this.myicon = ThumbsUp
          break
        default:
          this.myicon = navicon
          break
      }
    },
  },
}
</script>
