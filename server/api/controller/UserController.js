/* eslint-disable no-console */
const moment = require('moment')
const MotherShip = require('../backend/MotherShip')
const bancho = require('../backend/BanchoApiV2')

const mothership = new MotherShip()
// const bancho = new Bancho({
//   clientId: process.env.BANCHO_API_V2_CLIENTID,
//   clientSecret: process.env.BANCHO_API_V2_CLIENTSECRET
// })
// bancho.init()

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
      rtn.messages.push('error-occured')
      return rtn
    }
  }

  static async bestPlay (handle, mode, { startDate = undefined, endDate, startHoursBefore, endHoursBefore } = {}) {
    let start
    let end
    console.log({ startHoursBefore })
    if (startHoursBefore) {
      startDate = new Date()
      startDate.setHours(startDate.getHours() - startHoursBefore)
      start = startDate
      endDate = new Date()
      endDate.setHours(endDate.getHours() - endHoursBefore || 0)
      end = endDate
    } else {
      if (!startDate) {
        startDate = new Date(0)
        // startDate.setHours(0)
        // startDate.setMinutes(0)
        // startDate.setSeconds(0)
      }
      start = startDate
      end = endDate || new Date()
    }

    const rtn = {
      messages: []
    }
    try {
      const user = await bancho.getUser(handle)
      rtn.user = user
      const rps = await bancho.getUserBestScores(user, { mode, limit: 100 })
      if (!rps || !rps.length) {
        rtn.messages.push('no-bp')
        return rtn
      }
      rtn.scores = rps.filter((score) => {
        const date = moment(score.created_at).toDate()
        return date >= start && date <= end
      })
      return rtn
    } catch (error) {
      console.log(error)
      rtn.messages.push('error-occured')
      return rtn
    }
  }

  static async getScore (mode, scoreId) {
    const score = await bancho.getScore({ mode, id: scoreId })
    if (!score) { return {} }
    return {
      score,
      user: await bancho.getUser({ id: score.user_id })
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
