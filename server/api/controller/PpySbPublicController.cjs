const sb = require('../backend/PpySbApiV2.cjs')

class PpySbPublicController {
  static async getScore (mode, scoreId) {
    const res = await sb.getScore({ mode, scoreId })
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

  // static getMatchInfo (matchId) {
  //   return sb.getMatch(matchId)
  // }
}

module.exports = PpySbPublicController
