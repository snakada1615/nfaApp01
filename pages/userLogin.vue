<template>
  <b-container>
    <b-button
      id="jestButton1"
      variant="primary"
      size="sm"
      :disabled="!inputValidate"
      @click="login"
    >
      login
    </b-button>
    <b-button to="/userReg" size="sm" variant="info-2" class="text-white">
      register
    </b-button>
    <b-button to="/userEdit" size="sm" variant="info-2" class="text-white">
      edit current user
    </b-button>
    <b-button
      id="jestButton2"
      size="sm"
      variant="warning"
      :disabled="!isLoggedIn"
      @click="logOutUser"
    >
      logout
    </b-button>
    <b-row class="my-2">
      <b-col cols="11">
        <b-form-input
          id="jestInput1"
          v-model="user"
          placeholder="Enter username"
          :state="stateName"
        />
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="11">
        <b-form-input
          id="jestInput2"
          v-model="pass"
          :type="typePass"
          placeholder="Enter password"
          :state="statePass"
        />
      </b-col>
      <b-col cols="1" class="py-1 px-0">
        <p class="h5">
          <b-icon
            v-if="typePass === 'password'"
            icon="eye"
            @click="togglePass"
          />
          <b-icon
            v-if="typePass === 'text'"
            icon="eyeSlash"
            @click="togglePass"
          />
        </p>
      </b-col>
    </b-row>
    <div v-if="errorMessage" class="text-warning" size="sm">
      ({{ errorMessage }})
    </div>
    <b-card bg-variant="light">
      <div>
        login status:
        <span v-if="isLoggedIn" class="text-success">on</span>
        <span v-else class="text-danger">off</span>
      </div>
      <div>name:{{ currentFamilyName }}</div>
      <div>uid:{{ uid }}</div>
      <hr />
      {{ myApp.current }}
      <hr />
      {{ currentFamilyName }}
      {{ $store.getters['fire/currentFamilyName'] }}
      {{ myApp.userInfo }}
    </b-card>
  </b-container>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      user: '',
      pass: '',
      typePass: 'password',
      errorMessage: '',
      errorMessageList: [
        'login error: username or password does not match',
        'registration error: username already in use',
      ],
    }
  },
  computed: {
    ...mapState('fire', ['myApp']),
    ...mapGetters('fire', ['currentFamilyName']),
    uid() {
      return this.myApp.userInfo.uid
    },
    displayName() {
      return this.myApp.userInfo.displayName
    },
    isLoggedIn() {
      return this.myApp.current.isLoggedIn
    },
    stateName() {
      return /^[\w]{3,30}?$/.test(this.user)
    },
    statePass() {
      return this.pass.length >= 6 && this.pass.length <= 20
    },
    inputValidate() {
      return this.statePass && this.stateName
    },
    logOutValidate() {
      return !this.isLoggedIn
    },
  },
  methods: {
    ...mapActions('fire', [
      'registerEmail',
      'loginEmail',
      'updateIsLoggedIn',
      'logOut',
    ]),
    togglePass() {
      if (this.typePass === 'text') {
        this.typePass = 'password'
      } else {
        this.typePass = 'text'
      }
    },
    async register() {
      await this.registerEmail({
        name: this.user,
        password: this.pass,
      }).catch((err) => {
        console.log(err)
        if (err.message.indexOf('auth/email-already-in-use')) {
          this.user = ''
          this.pass = ''
          this.errorMessage = this.errorMessageList[1]
        }
      })
    },
    async login() {
      await this.loginEmail({ name: this.user, password: this.pass }).catch(
        (err) => {
          console.log(err)
          // error messageの表示
          if (err.message.indexOf('auth/internal-error')) {
            this.user = ''
            this.pass = ''
            this.errorMessage = this.errorMessageList[0]
          }
          // login状態をfalseにセット
          this.updateIsLoggedIn(false)
        }
      )
      // login状態をtrueにセット
      await this.updateIsLoggedIn(true)

      // error messageのクリア（もし表示れている場合には）
      this.errorMessage = ''
    },
    logOutUser() {
      this.logOut()
      // login状態をfalseにセット
      this.updateIsLoggedIn(false)
    },
  },
}
</script>
