<template>
<b-container>
  <div>{{ $t('apple') }}</div>
  <div>{{ $t('home.title.introduction') }}</div>

  <b-list-group>
    <b-list-group-item
      v-for="locale in availableLocales"
      :key="locale.code"
      href="#"
      @click="() => changeLocale(locale.code)"
    >
        {{ locale.code }}
    </b-list-group-item>
  </b-list-group>
</b-container>
</template>

<script>
export default {
  name: "MyTest03",
  components: {},
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
  methods: {
    /**
     * リロードなし
     * クッキーと、$i18n独自ストアのlocaleに言語を設定する
     * 直接storeを書き換えるためリロードは不要
     */
    async changeLocale(locale) {
      await this.$i18n.setLocale(locale)
    },
  }
}
</script>
