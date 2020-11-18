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
    try {
      const user = await bancho.getUser(handle, mode).catch(() => { throw new Error(1) })
      const statisticsHistory = await mothership.getUserHistory(user, oneYearBefore).catch((err) => {
        console.error(err.stack)
        return []
      })
      return {
        user,
        statisticsHistory
      }
    } catch (error) {
      console.log(error.stack)
    }
  }
}

module.exports = User
