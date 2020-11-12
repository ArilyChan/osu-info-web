const MotherShip = require('../backend/MotherShip')
const Bancho = require('../backend/BanchoApiV2')

const mothership = new MotherShip()
const bancho = new Bancho({
  clientId: process.env.BANCHO_API_V2_CLIENTID,
  clientSecret: process.env.BANCHO_API_V2_CLIENTSECRET
})
bancho.init()

class User {
  static async getUserInfo (handle, mode) {
    const oneYearBefore = new Date()
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1)
    const user = await bancho.getUser(handle, mode)
    const statisticsHistory = await mothership.getUserHistory(user, oneYearBefore)

    return {
      user,
      statisticsHistory
    }
  }
}

module.exports = User
