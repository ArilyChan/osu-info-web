/* eslint-disable no-console */
const moment = require('moment')
const MotherShip = require('../backend/MotherShip')
const bancho = require('../backend/BanchoApiV2')
const osuTrack = require('../backend/OsuTrack')
const UserModel = require('../model/BanchoUser.js')

const mothership = new MotherShip()

class BanchoUserController {
  static async getUserInfo (handle, mode) {
    const oneYearBefore = new Date()
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1)
    try {
      const userResult = await bancho.getUser(handle, mode)
      const user = new UserModel(userResult)
      if (!user.data.id) { throw new Error('not-found') }
      const recentActivity = user.getActivity(30, 0).then(activities => activities.filter((activity) => {
        if (!['rank', 'rankLost'].includes(activity.type)) { return true }
        if (!mode) { return true }
        return activity.mode === mode
      })).then(activities => activities.slice(0, 10))
      const historicalBest = osuTrack.getUserHistoricalBest(user.data)
      osuTrack.updateUser(user.data).catch(() => {})
      let statisticsHistory
      if (user.data.playmode === 'osu') {
        statisticsHistory = mothership.getUserHistory(user.data, oneYearBefore).catch((err) => {
          console.error(err.stack)
        })
      }
      return {
        user: user.data,
        recentActivity: await recentActivity,
        statisticsHistory: await statisticsHistory,
        historicalBest: await historicalBest
      }
    } catch (error) {
      console.log(error.stack)
      throw error
    }
  }

  static async recentPlay (handle, mode) {
    const rtn = {
      messages: []
    }
    try {
      const banchoUserResult = await bancho.getUser(handle)
      const user = new UserModel(banchoUserResult)
      rtn.user = user.data
      const rps = await user.getRecentScores({ mode, include_fails: 1 })
      const rp = rps[0]
      if (!rp) {
        rtn.messages.push('no-recent')
        return rtn
      }
      rtn.score = rp
      try {
        if (!user.data.is_supporter) { rtn.messages.push('may-need-supporter') }
        const countryRank = await user.getCountryRankingOnBeatmap(rp.beatmap)
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
      console.error(error.stack)
      rtn.messages.push('error-occured')
      return rtn
    }
  }

  static async bestPlay (handle, mode, { startDate = undefined, endDate, startHoursBefore, endHoursBefore } = {}) {
    let start
    let end
    if (startHoursBefore) {
      startDate = new Date()
      startDate.setUTCHours(startDate.getUTCHours() - startHoursBefore)
      start = startDate
      endDate = new Date()
      endDate.setUTCHours(endDate.getUTCHours() - (endHoursBefore || 0))
      end = endDate
    } else {
      start = startDate || new Date(0)
      end = endDate || new Date()
    }

    const rtn = {
      messages: []
    }
    try {
      const userResult = await bancho.getUser(handle)
      const user = new UserModel(userResult)
      rtn.user = user.data
      const rps = await user.getBestScores({ mode, limit: 100 })
      if (!rps || !rps.length) {
        rtn.messages.push('no-bp')
        return rtn
      }
      rtn.scores = rps.filter((score) => {
        const date = moment.utc(score.created_at).toDate()
        // console.log(date, date >= start && date <= end)
        return date >= start && date <= end
      })
      return rtn
    } catch (error) {
      rtn.messages.push('error-occured')
      return rtn
    }
  }

  static setUserToken (user, token, scope) {
    return bancho.setUserToken(user, token, scope)
  }

  static OAuthCode (code, scope) {
    return bancho.userOAuthCode(code, scope)
  }
}

module.exports = BanchoUserController
