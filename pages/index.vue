<template>
  <b-container>
    <div>{{ $t('hello') }}</div>
    <b-row>
      <b-col>
        <b-card-group deck>
          <b-card
            v-for="(item, index) in menuList"
            :key="index"
            bg-variant="light"
          >
            <b-card-text class="d-flex align-items-center overflow-auto">
              <b-icon :icon="item.icon" font-scale="3" />
              <h3 class="ml-2">{{ $t(item.text) }}</h3>
            </b-card-text>
            <b-button block :to="item.link">go</b-button>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      menuList: [
        { text: 'index.link.login', icon: 'door-open-fill', link: 'userLogin' },
        {
          text: 'index.link.setFamily',
          icon: 'person-plus',
          link: 'setFamily',
        },
        {
          text: 'index.link.setCurrentDiet',
          icon: 'receipt',
          link: 'setCurrentDiet',
        },
      ],
    }
  },
}
</script>
