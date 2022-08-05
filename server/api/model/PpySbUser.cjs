const BaseUser = require('./BaseUser.cjs')
class PpySbUser extends BaseUser {
  constructor (d) {
    super(d)
    this.api = require('../backend/PpySbApiV2.cjs')
  }
}

module.exports = PpySbUser
