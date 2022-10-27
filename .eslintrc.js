module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {},
  ignorePatterns: ['client/components/argon/*', 'client/components/argon-components/*', 'client/components/argon-demo/*', 'client/components/argon-layout/*', 'client/components/**/waste']
}
