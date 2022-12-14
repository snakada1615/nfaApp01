module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  // extends: ['@nuxtjs', 'plugins:nuxt/recommended', 'prettier'],
  extends: ['@nuxtjs', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {},
}
