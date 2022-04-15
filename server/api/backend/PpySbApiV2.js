// const axios = require('axios')
const BaseApiV2 = require('./BaseApiV2')

class PpySbApiV2 extends BaseApiV2 {
  constructor () {
    super({ apiBase: 'https://osu.ppy.sb/apiv2' })
  }

  publicTokenHeader () {
    return null
  }
}

const instance = new PpySbApiV2()
module.exports = instance
