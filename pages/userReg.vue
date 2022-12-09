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
          <div class="text-muted">
            --- required info---
          </div>
          <b-input-group class="my-1">
            <b-input-group-prepend class="w-25">
              <b-input-group-text class="w-100">
                user Name
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input v-model="newUser" placeholder="Enter username" :state="stateName" />
          </b-input-group>
          <b-input-group class="my-1">
            <b-input-group-prepend class="w-25">
              <b-input-group-text class="w-100">
                password
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input v-model="newPass" :type="typePass" placeholder="Enter password" :state="statePass" />
            <b-input-group-append>
              <b-input-group-text>
                <b-icon v-if="typePass==='password'" icon="eye" @click="togglePass" />
                <b-icon v-if="typePass==='text'" icon="eyeSlash" @click="togglePass" />
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
          <div v-if="errorMessage" class="text-danger" size="sm">
            ({{ errorMessage }})
          </div>
          <hr>
          <div class="text-muted">
            --- optional info---
          </div>
          <b-input-group class="my-1">
            <b-input-group-prepend class="w-25">
              <b-input-group-text class="w-100">
                country
              </b-input-group-text>
            </b-input-group-prepend>
            <country-names :key1.sync="user.country" />
            <region-select
              v-if="user.country === 'Ethiopia'"
              :key3.sync="user.subnational3"
              :key2.sync="user.subnational2"
              :key1.sync="user.subnational1"
            />
          </b-input-group>
          <b-input-group class="my-1">
            <b-input-group-prepend class="w-25">
              <b-input-group-text class="w-100">
                organization
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input
              v-model="user.organization"
              placeholder="Enter your organization"
            />
          </b-input-group>
          <b-input-group class="my-1">
            <b-input-group-prepend class="w-25">
              <b-input-group-text class="w-100 text-capitalize">
                title
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input
              v-model="user.title"
              placeholder="Enter your role in the organization"
            />
          </b-input-group>
          <b-input-group class="my-1">
            <b-input-group-prepend class="w-25">
              <b-input-group-text class="w-100">
                user type
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-radio-group
              v-model="user.userType"
              :options="userOptions"
              button-variant="outline-primary"
              size="sm"
              buttons
              @input="onUserTypeChange"
            />
          </b-input-group>
          <hr>
          <b-button
            variant="primary"
            :disabled="!inputValidate"
            @click="register"
          >
            register
          </b-button>
        </b-col>
      </b-row>

      <pass-check-dialogue
        :password="myPass"
        modal-name="passCheckBox"
        :show-modal.sync="openPassCheckFlag"
        text-description="you need password to have admin status"
        @correctInput="onCorrectInput"
        @wrongInput="onWrongInput"
      />
    </b-card>
  </b-container>
</template>

<script>
import passCheckDialogue from '../components/atoms/passCheckDialogue'
import { makeToast } from '@/plugins/helper'
import regionSelect from '@/components/atoms/regionSelect'
import countryNames from '@/components/atoms/countryNames'

export default {
  components: {
    regionSelect,
    countryNames,
    passCheckDialogue
  },
  data () {
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
        userType: 'normal'
      },
      /**
       * userの権限設定
       */
      userOptions: [
        { text: 'normal user', value: 'normal' },
        { text: 'admin user', value: 'admin' }
      ],
      newPass: '',
      typePass: 'password',
      errorMessage: '',
      errorMessageList: [
        'login error: username or password does not match',
        'registration error: username already in use'
      ],
      openPassCheckFlag: false,
      myPass: ''
    }
  },
  computed: {
    stateName () {
      return (/^[\w]{3,30}?$/).test(this.newUser)
    },
    statePass () {
      return (this.newPass.length >= 3 && this.newPass.length <= 20)
    },
    inputValidate () {
      return this.statePass && this.stateName
    }
  },
  created () {
    this.myPass = this.$store.state.fire.adminPass
  },
  methods: {
    togglePass () {
      if (this.typePass === 'text') {
        this.typePass = 'password'
      } else {
        this.typePass = 'text'
      }
    },
    async register () {
      let loginFail = false
      await this.$store.dispatch('fire/registerEmail', { name: this.newUser, password: this.newPass })
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
      await this.$store.dispatch('fire/initAll', this.$store.state.fire.myApp.user)
      makeToast(this, 'user data initialized!')

      // ユーザーの国がEthiopiaの場合とそうでない場合で飛び先を変更
      this.$router.push('/startPageEth')
      // if (this.user.country === 'Ethiopia') {
      //   await this.$router.push('/startPageEth')
      // } else {
      //   await this.$router.push('/')
      // }
    },
    async updateUserInfo () {
      const myUser = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.user))
      myUser.country = this.user.country
      myUser.organization = this.user.organization
      myUser.title = this.user.title
      myUser.userType = this.user.userType
      myUser.subnational1 = this.user.subnational1
      myUser.subnational2 = this.user.subnational2
      myUser.subnational3 = this.user.subnational3

      // storeのアップデート
      await this.$store.dispatch('fire/updateUser', myUser)
      await this.$store.dispatch('fire/fireSaveAppdata')
      console.log('user profile updated')
    },
    onUserTypeChange (val) {
      if (val === 'admin') {
        this.openPassCheckFlag = true
      }
    },
    onWrongInput () {
      alert('please check admin password')
      this.user.userType = 'normal'
    },
    onCorrectInput () {
      makeToast(this, 'admin status have set')
    }
  }
}
</script>
