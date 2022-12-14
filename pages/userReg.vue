<template>
  <b-container>
    <b-card
      header="register new user"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <b-row class="my-2">
        <b-col class="px-2">
          <div class="text-muted">--- required info---</div>
          <!-- 名前の記入         -->
          <b-input-group class="my-1" size="sm" prepend="user name">
            <b-form-input
              v-model="newUser"
              placeholder="Enter username"
              :state="stateName"
            />
          </b-input-group>
          <!-- パスワード記入         -->
          <b-input-group class="my-1" size="sm" prepend="password">
            <b-form-input
              v-model="newPass"
              :type="typePass"
              placeholder="Enter password"
              :state="statePass"
            />
            <!-- パスワード表示/非表示の切り替え           -->
            <b-input-group-append>
              <b-input-group-text>
                <b-icon :icon="passIcon" @click="togglePass" />
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
          <div v-if="errorMessage" class="text-danger" size="sm">
            ({{ errorMessage }})
          </div>
          <hr />

          <!-- ユーザーの追加情報登録         -->
          <div class="text-muted">--- optional info---</div>

          <!-- 国情報           -->
          <b-input-group class="my-1" size="sm" prepend="country">
            <country-names :key1.sync="user.country" class="my-0" />
          </b-input-group>
          <region-select
            v-if="user.country === 'Ethiopia'"
            class="pl-3 pr-0"
            :key3.sync="user.subnational3"
            :key2.sync="user.subnational2"
            :key1.sync="user.subnational1"
          />

          <!-- 組織情報         -->
          <b-input-group class="my-1" size="sm" prepend="organization">
            <b-form-input
              v-model="user.organization"
              placeholder="Enter your organization"
            />
          </b-input-group>

          <!-- 役職         -->
          <b-input-group class="my-1" size="sm" prepend="title">
            <b-form-input
              v-model="user.title"
              placeholder="Enter your role in the organization"
            />
          </b-input-group>

          <!-- admin資格の設定         -->
          <b-input-group class="my-1" size="sm" prepend="user type">
            <b-form-radio-group
              v-model="user.userType"
              :options="userOptions"
              button-variant="outline-primary"
              size="sm"
              buttons
              @input="onUserTypeChange"
            />
          </b-input-group>
          <b-button
            variant="primary"
            :disabled="!inputValidate"
            @click="register"
          >
            register
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import { makeToast } from '@/plugins/helper'
import regionSelect from '@/components/atoms/regionSelect'
import countryNames from '@/components/atoms/countryNames'

export default {
  components: {
    regionSelect,
    countryNames,
  },
  data() {
    return {
      /**
       * 新規登録用のユーザー名
       */
      newUser: '',
      /**
       * state.fire.myApp.userのクローン
       */
      user: {
        displayName: '',
        country: '',
        organization: '',
        title: '',
        uid: '',
        phoneNumber: '',
        subnational1: '',
        subnational2: '',
        subnational3: '',
        userType: 'normal',
      },
      /**
       * userの権限設定
       */
      userOptions: [
        { text: 'normal user', value: 'normal' },
        { text: 'admin user', value: 'admin' },
      ],
      newPass: '',
      typePass: 'password',
      errorMessage: '',
      errorMessageList: [
        'login error: username or password does not match',
        'registration error: username already in use',
      ],
      openPassCheckFlag: false,
      myPass: '',
    }
  },
  computed: {
    passIcon() {
      if (this.typePass === 'text') {
        return 'eye'
      } else {
        return 'eyeSlash'
      }
    },
    stateName() {
      return /^[\w]{3,30}?$/.test(this.newUser)
    },
    statePass() {
      return this.newPass.length >= 3 && this.newPass.length <= 20
    },
    inputValidate() {
      return this.statePass && this.stateName
    },
  },
  created() {
    this.myPass = this.$store.state.fire.adminPass
  },
  methods: {
    togglePass() {
      if (this.typePass === 'text') {
        this.typePass = 'password'
      } else {
        this.typePass = 'text'
      }
    },
    async register() {
      let loginFail = false
      await this.$store
        .dispatch('fire/registerEmail', {
          name: this.newUser,
          password: this.newPass,
        })
        .catch((err) => {
          console.log(err)
          loginFail = true
          if (err.message.indexOf('auth/email-already-in-use')) {
            this.newUser = ''
            this.newPass = ''
            this.errorMessage = this.errorMessageList[1]
          }
        })
      if (loginFail) {
        return
      }
      // user情報を更新
      await this.updateUserInfo()
      makeToast(this, 'user data registered!')

      // myAppを初期化
      await this.$store.dispatch(
        'fire/initAll',
        this.$store.state.fire.myApp.user
      )
      makeToast(this, 'user data initialized!')
      this.$router.push('/')
    },
    async updateUserInfo() {
      const myUser = this.$store.state.fire.userInfo.map((item) => ({
        ...item,
      }))
      myUser.country = this.user.country
      myUser.organization = this.user.organization
      myUser.title = this.user.title
      myUser.userType = this.user.userType
      myUser.subnational1 = this.user.subnational1
      myUser.subnational2 = this.user.subnational2
      myUser.subnational3 = this.user.subnational3

      // storeのアップデート
      const vm = this
      await this.$store.dispatch('fire/updateUser', myUser)
      await this.$store.dispatch('fire/updateLoadingState', true)
      await this.$store.dispatch('fire/fireSaveMyApp').catch((err) => {
        console.log(err)
        vm.$store.dispatch('fire/updateLoadingState', false)
      })
      await this.$store.dispatch('fire/updateLoadingState', false)
      console.log('userdata updated')
    },
    onUserTypeChange(val) {
      if (val === 'admin') {
        this.openPassCheckFlag = true
      }
    },
    onWrongInput() {
      alert('please check admin password')
      this.user.userType = 'normal'
    },
    onCorrectInput() {
      makeToast(this, 'admin status have set')
    },
  },
}
</script>
