<template>
  <b-container>
    <div>{{ $t('hello') }}</div>
    <b-row>
      <b-col>
        <b-card-group deck>
          <b-card bg-variant="light">
            <b-card-text class="d-flex align-items-center">
              <b-icon icon="person-plus" font-scale="4" />
              <h3 class="ml-2">{{ $t('index.link.setFamily') }}</h3>
            </b-card-text>
            <b-button block to="setFamily">go</b-button>
          </b-card>
          <b-card bg-variant="light">
            <b-card-text class="d-flex align-items-center">
              <b-icon icon="receipt" font-scale="4" />
              <h3 class="ml-2">{{ $t('index.link.setCurrentDiet') }}</h3>
            </b-card-text>
            <b-button block to="setCurrentDiet">go</b-button>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'IndexPage',
  created() {
    const res = this.$t('index.link.setFamily')
    console.log(res)
  },
}
</script>
