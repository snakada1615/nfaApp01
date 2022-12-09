<template>
  <b-modal
    v-model="showModalComputed"
    :header-bg-variant="headerVariant"
    :id="modalName"
    :title="modalHeader"
    :hideHeaderClose="true"
    no-close-on-esc
    static
    @ok="onClickOk"
    @cancel="onClickCancel"
  >
    <b-card
      v-if="textDescription.length > 0"
      border-variant="white"
      class="px-0 py-0 mx-0 my-0"
    >
      {{ textDescription }}
    </b-card>
    <b-input-group>
      <b-input-group-text>password</b-input-group-text>
      <b-form-input
        type="password"
        v-model="userPass"
        @update="onPassUpdate"
      />
    </b-input-group>
    <h1 class="text-danger small" v-if="!statePassword && clickOk">password is incorrect</h1>
  </b-modal>
</template>

<script>
export default {
  name: "passCheckDialogue",
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    modalName: {
      type: String,
      required: true
    },
    modalHeader: {
      type: String,
      default: 'password check'
    },
    password: {
      type: String,
      required: true
    },
    textDescription: {
      type: String,
      default: ''
    },
    headerVariant: {
      type: String,
      default: "warning"
    },
  },
  data() {
    return {
      userPass: '',
      clickOk: false,
      modalResultComputed: false,
    }
  },
  watch: {
    showModalComputed: {
      handler(val) {
        if (!val) {
          this.userPass = ''
        } else {
          this.modalResultComputed = false
        }
      }
    },
    modalResultComputed:{
      handler(val) {
        this.$emit('update:modalResult', val)
      }
    }
  },
  created() {
    this.modalResultComputed = this.modalResult
  },
  computed: {
    showModalComputed: {
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      },
    },
    statePassword() {
      return this.userPass === this.password
    },
  },
  methods: {
    onClickOk(bvModalEvent) {
      this.clickOk = true
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    onClickCancel() {
      this.$emit('wrongInput')
    },
    onPassUpdate() {
      this.clickOk = false
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.statePassword) {
        return
      }
      this.modalResultComputed = true
      this.$emit('correctInput')
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide(this.modalName)
      })
    }
  }
}
</script>
