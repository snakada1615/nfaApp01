export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nfaApp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  router: {
    middleware: 'login',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '@/plugins/helper' }, { src: '@/plugins/firebasePlugin' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      'bootstrap-vue/nuxt',
      {
        // Add the desired icon components to the `components` array
        css: false,
        icons: true,
        componentPlugins: [
          'NavbarPlugin',
          'LayoutPlugin',
          'BadgePlugin',
          'ButtonPlugin',
          'ModalPlugin',
          'PaginationPlugin',
          'TabsPlugin',
          'CarouselPlugin',
          'CardPlugin',
          'ToastPlugin',
          'TablePlugin',
          'TooltipPlugin',
          'InputGroupPlugin',
          'FormPlugin',
          'FormGroupPlugin',
          'FormInputPlugin',
          'FormFilePlugin',
          'FormSelectPlugin',
          'FormCheckboxPlugin',
          'FormRadioPlugin',
          'FormTextareaPlugin',
          'ListGroupPlugin',
          'DropdownPlugin',
          'ImagePlugin',
          'ProgressPlugin',
          'OverlayPlugin',
          'FormDatepickerPlugin',
        ],
      },
    ],
    'bootstrap-vue/nuxt',

    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',

    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    // https://i18n.nuxtjs.org/
    '@nuxtjs/i18n',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // multi-language, i18n
  i18n: {
    locales: [
      { code: 'ja', iso: 'ja_JP', file: 'ja.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'fr', iso: 'fr-fr', file: 'fr.json' },
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
    },
    detectBrowserLanguage: { alwaysRedirect: true },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // storybook options
  // nuxt.config.js
  storybook: {
    // 追加のアドオン
    // デフォルトではstorybook/addon-essentialsが含まれてます、含まれてるaddonは下記リンクを参照
    // https://storybook.js.org/docs/react/essentials/introduction
    addons: [],
    // storybookのポート指定
    port: 4000,
    // 背景色や表示位置、デバイスの設定など
    parameters: {
      // 背景色：デフォルトの色を使う場合
      backgrounds: {
        default: 'light', // light or dark
      },
      // Description, Default, Controlsカラムの表示
      controls: {
        expanded: true,
      },
      // 表示位置
      // centered:中央表示, padded:コンポーネントに余白付与, fullscreen:幅いっぱい
      layout: 'centered',
    },
  },
}
