const bancho = require('../backend/BanchoApiV2.cjs')

class BanchoPublicController {
  static async getScore (mode, scoreId) {
    const res = await bancho.getScore({ mode, scoreId })
    if (!res) { return {} }
    const score = {
      ...res,
      user: undefined
    }
    return {
      score,
      user: res.user
      // user: await bancho.getUser(res.user.id || res.user_id)
    }
  }

  static getMatchInfo (matchId) {
    return bancho.getMatch(matchId)
  }
}

module.exports = BanchoPublicController
