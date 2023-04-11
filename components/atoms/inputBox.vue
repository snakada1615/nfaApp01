<template>
  <b-modal
    :id="modalName"
    ref="modal"
    :title="title"
    header-bg-variant="info"
    :hide-footer="hideFooter"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <b-overlay :show="showSpinner" rounded="sm">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :label="label"
          label-for="text-input"
          invalid-feedback="please fill the text. no space at the beginning or end"
          :state="stateInput"
        >
          <b-form-input
            id="text-input"
            v-model="userText"
            :state="stateInput"
            required
            pattern="\w.*\w$"
          />
        </b-form-group>
      </form>
    </b-overlay>
  </b-modal>
</template>

<script>
export default {
  name: 'InputBox',
  props: {
    modalName: {
      type: String,
      required: true
    },
    textInput: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'user text input'
    },
    label: {
      type: String,
      default: 'type text'
    },
    showSpinner: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userText: '',
      stateInput: null
    }
  },
  methods: {
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.stateInput = valid
      return valid
    },
    resetModal () {
      this.userText = this.textInput
      this.stateInput = null
    },
    handleOk (bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the userText to parent
      this.$emit('update:textInput', this.userText)

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide(this.modalName)
      })
    }
  }
}
</script>
