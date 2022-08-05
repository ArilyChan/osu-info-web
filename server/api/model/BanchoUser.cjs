// const banchoBackend =
const BaseUser = require('./BaseUser.cjs')
class BanchoUser extends BaseUser {
  constructor (osuApiUser) {
    super(osuApiUser)
    this.api = require('../backend/BanchoApiV2.cjs')
  }
}

module.exports = BanchoUser
