// const banchoBackend =
const BaseUser = require('./BaseUser.js')
class BanchoUser extends BaseUser {
  constructor (osuApiUser) {
    super(osuApiUser)
    this.api = require('../backend/BanchoApiV2')
  }
}

module.exports = BanchoUser
