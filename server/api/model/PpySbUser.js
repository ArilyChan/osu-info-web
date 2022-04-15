const BaseUser = require('./BaseUser')
class PpySbUser extends BaseUser {
  constructor (d) {
    super(d)
    this.api = require('../backend/PpySbApiV2')
  }
}

module.exports = PpySbUser
