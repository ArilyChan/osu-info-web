class BaseUser {
  constructor (data) {
    this.data = data
    this.api = {}
  }

  getRecentScores (arg) {
    return this.api.getUserRecentScores(this.data, arg)
  }

  getCountryRankingOnBeatmap (bm) {
    return this.api.getBeatmapScoresCountry(bm, this.data)
  }

  getBestScores (arg) {
    return this.api.getUserBestScores(this.data, arg)
  }

  getActivity (limit, start) {
    return this.api.getUserActivity(this.data, limit, start)
  }

  setToken (token, scope) {
    return this.api.setUserToken(this.data, token, scope)
  }
}

module.exports = BaseUser
