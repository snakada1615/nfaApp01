<template>
  <b-container>
    <b-form-group label="Add/Edit Family Member">
      <!--   Add/Editの選択   -->
      <b-form-radio-group
        v-model="modeNewFamily"
        :options="['Add', 'Select']"
        button-variant="outline-primary"
        buttons
        size="sm"
        class="mb-2"
        @change="initMember"
      />

      <!-- 新規入力用の名前設定 -->
      <b-input-group v-if="modeNewFamily === 'Add'" prepend="name" size="sm">
        <b-form-input
          v-model="newFamilyName"
          type="text"
          :state="stateFamilyName"
        />
        <b-button
          :disabled="!stateFamilyName || familySize === 0"
          size="sm"
          @click="addNewFamily(newFamilyName, tablePop)"
          >add
        </b-button>
      </b-input-group>

      <!-- 既存のFamily選択 -->
      <b-input-group
        v-if="modeNewFamily === 'Select' && familyList.length > 0"
        prepend="select"
        size="sm"
      >
        <b-select
          v-model="selectedFamilyName"
          :options="$store.getters['fire/familyList']"
          @change="selectFamily"
        ></b-select>
        <!-- 削除用ボタン -->
        <template #append>
          <b-input-group-text>
            <b-icon
              icon="BIconTrash"
              style="cursor: pointer"
              @click="removeFamily(selectedFamilyName)"
            />
          </b-input-group-text>
        </template>
      </b-input-group>

      <!-- 選択するFamilyがない場合 -->
      <div
        v-if="modeNewFamily === 'Select' && familyList.length === 0"
        class="small text-danger"
      >
        no family registered yet
      </div>
    </b-form-group>

    <!-- メンバー構成の設定 -->
    <update-family
      :member.sync="tablePop"
      :dri="$store.state.fire.driObject"
      @update="updateFlagForFamily"
    />
  </b-container>
</template>

<script>
import { makeToast } from '@/plugins/helper'
import updateFamily from '@/components/molecules/updateFamily'

export default {
  name: 'SetFamily',
  components: {
    updateFamily,
  },
  data() {
    return {
      /**
       * 最初のテーブルを埋めるデータ（年齢・性別毎の人数）
       */
      tablePop: [],
      initPop: [],
      newFamilyName: '',
      selectedFamilyName: '',
      modeNewFamily: true,
    }
  },
  computed: {
    familyList: {
      get() {
        return this.$store.state.fire.families
      },
    },
    familySize: {
      get() {
        return this.tablePop.reduce((accum, curr) => {
          accum += curr.number
          return accum
        }, 0)
      },
    },
    stateFamilyName: {
      get() {
        return this.newFamilyName.length > 3
      },
    },
  },
  created() {
    this.initPop = JSON.parse(
      JSON.stringify(this.$store.getters['fire/initialMembers'])
    )
    this.tablePop = JSON.parse(
      JSON.stringify(this.$store.getters['fire/initialMembers'])
    )
  },
  methods: {
    test(val) {
      makeToast(this, val)
      console.log(val)
    },

    /**
     * 新規家族の追加
     * @param name
     * @param member
     */
    addNewFamily(name, member) {
      this.$store.dispatch('fire/addNewFamily', {
        name,
        member,
      })
      this.modeNewFamily = 'Select'
      this.$store.dispatch('fire/setUpdateFlag', {
        element: 'families',
        value: true,
      })
      makeToast(this, 'upload complete')
    },

    /**
     * ドキュメント更新フラグを立てる
     */
    updateFlagForFamily() {
      // 新規追加の場合はSaveボタンを押すまでは無視。既存家族を編集している場合は常時更新フラグを立てる位
      if (this.modeNewFamily === 'Add') {
        return
      }
      this.$store.dispatch('fire/setUpdateFlag', {
        element: 'families',
        value: true,
      })
    },

    /**
     * tab切替時に変数初期化
     */
    initMember() {
      this.tablePop.splice(0, this.tablePop.length, ...this.initPop)
      this.newFamilyName = ''
      this.selectedFamilyName = ''
    },

    /**
     * 家族選択時に変数を割り当てる
     * @param val
     */
    selectFamily(val) {
      const resPop = this.$store.state.fire.families.find(
        (item) => item.name === val
      ).member
      this.tablePop.splice(0, this.tablePop.length, ...resPop)
    },

    removeFamily(val) {
      if (!window.confirm('do you really want to remove family record?')) {
        return
      }
      this.$store.dispatch('fire/removeFamily', val)
    },
  },
}
</script>
