import Vue from 'vue'
const Moment = {}
const moment = require('dayjs')
Moment.install = function (Vue, { locale = 'en-gb' } = {}) {
  Vue.mixin({
    beforeCreate () {
      this.$moment.locale((this.$root.locale || locale) || 'en-GB')
    },
    methods: {
      moment (...any) {
        if (this.$root.locale !== this.$moment.locale) { this.setLocale() }
        return this.$moment(...any)
      },
      setLocale () {
        this.$moment.locale((this.$root.locale || locale) || 'en-GB')
      }
    }
  })

  Vue.prototype.$moment = moment
}

Vue.use(Moment)
