<template>
  <b-modal
    :id="modalName"
    ref="modal"
    v-model="isModalOpen"
    :title="title"
    header-bg-variant="info"
    :hide-footer="hideFooter"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <b-overlay :show="showSpinner" rounded="sm">
      <b-card>
        <div></div>
        <div></div>
        <div></div>
      </b-card>
      <template #overlay>
        <div class="text-center">
          <div>
            <b-icon
              icon="arrow-counterclockwise"
              animation="spin-reverse"
              font-scale="1"
            />
            <b-icon
              icon="arrow-counterclockwise"
              animation="spin-reverse"
              font-scale="1"
            />
            <b-icon
              icon="arrow-counterclockwise"
              animation="spin-reverse"
              font-scale="1"
            />
            <b-icon
              icon="arrow-counterclockwise"
              animation="spin-reverse"
              font-scale="1"
            />
            <b-icon
              icon="arrow-counterclockwise"
              animation="spin-reverse"
              font-scale="1"
            />
            <b-icon
              icon="arrow-counterclockwise"
              animation="spin-reverse"
              font-scale="1"
            />
          </div>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
    </b-overlay>
  </b-modal>
</template>

<script>
export default {
  name: 'LoadingBox',
  props: {
    modalName: {
      type: String,
      default: 'loadingBox',
    },
    textInput: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'date loading...',
    },
    label: {
      type: String,
      default: '',
    },
    showSpinner: {
      type: Boolean,
      default: true,
    },
    hideFooter: {
      type: Boolean,
      default: true,
    },
    openFlag: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      userText: '',
      stateInput: null,
    }
  },
  computed: {
    isModalOpen: {
      get() {
        return this.openFlag
      },
      set(val) {
        this.$emit('update:openFlag', val)
      },
    },
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.stateInput = valid
      return valid
    },
    resetModal() {
      this.userText = this.textInput
      this.stateInput = null
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
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
    },
  },
}
</script>
