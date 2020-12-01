/* eslint-disable no-console */
const MotherShip = require('../backend/MotherShip')
const Bancho = require('../backend/BanchoApiV2')

const mothership = new MotherShip()
const bancho = new Bancho({
  clientId: process.env.BANCHO_API_V2_CLIENTID,
  clientSecret: process.env.BANCHO_API_V2_CLIENTSECRET
})
bancho.init()

class UserController {
  static async getUserInfo (handle, mode) {
    const oneYearBefore = new Date()
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1)
    try {
      const user = await bancho.getUser(handle, mode).catch(() => { throw new Error(1) })
      if (!user.id) { return {} }
      const recentActivity = await bancho.getUserActivity(user, 10, 0)
      let statisticsHistory
      if (user.playmode === 'osu') {
        statisticsHistory = await mothership.getUserHistory(user, oneYearBefore).catch((err) => {
          console.error(err.stack)
          return []
        })
      }
      return {
        user,
        recentActivity,
        statisticsHistory
      }
    } catch (error) {
      console.log(error.stack)
    }
  }

  static async recentPlay (handle, mode) {
    const rtn = {
      messages: []
    }
    try {
      const user = await bancho.getUser(handle)
      rtn.user = user
      const rps = await bancho.getUserRecentScores(user, { mode })
      const rp = rps[0]
      if (!rp) {
        rtn.messages.push('no-recent')
        return rtn
      }
      rtn.score = rp
      try {
        if (!user.is_supporter) { rtn.messages.push('may-need-supporter') }
        const countryRank = await bancho.getBeatmapScoresCountry(rp.beatmap, user)
        countryRank.scores.forEach((score) => {
          delete score.beatmap
        })
        rtn.countryRank = countryRank
        return rtn
      } catch (error) {
        if (error.message === 'no token') { rtn.messages.push('connect-to-app-oauth') }
        return rtn
      }
    } catch (error) {
      return {}
    }
  }

  static setUserToken (user, token, scope) {
    return bancho.setUserToken(user, token, scope)
  }

  static OAuthCode (user, code, scope) {
    return bancho.userOAuthCode(user, code, scope)
  }
}

module.exports = UserController
