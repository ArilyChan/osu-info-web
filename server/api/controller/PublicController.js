const bancho = require('../backend/BanchoApiV2')

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
