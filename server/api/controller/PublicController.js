const bancho = require('../backend/BanchoApiV2')

// const bancho = new Bancho({
//   clientId: process.env.BANCHO_API_V2_CLIENTID,
//   clientSecret: process.env.BANCHO_API_V2_CLIENTSECRET
// })
// bancho.init()

class UserController {
  static async getScore (mode, scoreId) {
    const score = await bancho.getScore({ mode, scoreId })
    if (!score) { return {} }
    return {
      score,
      user: await bancho.getUser({ id: score.user_id })
    }
  }
}

module.exports = UserController
