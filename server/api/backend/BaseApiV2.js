const axios = require('axios')

class BaseApiV2 {
  constructor ({ apiBase, OAuthBase, models }) {
    this.apiBase = apiBase
    this.OAuthBase = OAuthBase
    this.models = models
  }

  apiCall (endpoint, axiosReq) {
    const req = {
      method: 'get',
      ...axiosReq,
      url: `${this.apiBase}${encodeURIComponent(endpoint)}`
    }
    return axios(req)
  }

  getScore ({ scoreId, mode }, { params, headers } = {}) {
    const options = {
      params,
      headers: headers || this.publicTokenHeader()
    }
    return this.apiCall(`/scores/${mode}/${scoreId}`, options).then(res => res.data)
  }

  getUser (handle, mode) {
    return this.apiCall(`/users/${handle}${mode ? `/${mode}` : ''}`, {
      headers: this.publicTokenHeader()
    }).then(res => res.data)
  }

  getUserMe (mode, { headers }) {
    return this.apiCall(`/me${mode ? `/${mode}` : ''}`, {
      headers: headers || this.publicTokenHeader()
    }).then(res => res.data)
  }

  getUserActivity (user, limit = 20, start = 0) {
    return this.apiCall(`/users/${user.id}/recent_activity`, {
      params: {
        limit,
        offset: start
      },
      headers: this.publicTokenHeader()
    }).then(res => res.data)
  }

  getUserKudosu (user, limit = 20, start = 0) {
    return this.apiCall(`/users/${user.id}/kudosu`, {
      params: {
        limit,
        offset: start
      },
      headers: this.publicTokenHeader()
    }).then(res => res.data)
  }

  async getUserScores (user, { type = 'best', limit = 12, ...options } = {}) {
    let page = 1
    let current = 0
    let last = 0
    const data = []
    if (limit > 50) {
      last = limit % 50
      page = Math.floor(limit / 50)
      for (;current < page; current += 1) {
        data.push(this.apiCall(`/users/${user.id}/scores/${type}`, {
          params: {
            ...options,
            limit: 50,
            offset: current * 50
          },
          headers: this.publicTokenHeader()
        }).then(res => res.data))
      }
    } else {
      last = limit
    }
    if (last) {
      data.push(this.apiCall(`/users/${user.id}/scores/${type}`, {
        params: {
          ...options,
          limit: last,
          offset: current * 50
        },
        headers: this.publicTokenHeader()
      }).then(res => res.data))
    }
    return [].concat(...await Promise.all(data))
  }

  getUserRecentScores (user, options) {
    return this.getUserScores(user, {
      ...options,
      type: 'recent'
    })
  }

  getUserBestScores (user, options) {
    return this.getUserScores(user, {
      ...options
    })
  }

  getBeatmapScores ({ id: beatmapId }, { params, headers } = {}) {
    const options = {
      params,
      headers: headers || this.publicTokenHeader()
    }
    return this.apiCall(`/beatmaps/${beatmapId}/scores`, options).then(res => res.data)
  }

  async getBeatmapScoresCountry (beatmap, user) {
    const userTokens = await this.getUserValidTokens(user, 'public')
    if (!userTokens.length) { throw new Error('no token') }
    return this.getBeatmapScores(beatmap, {
      params: {
        type: 'country'
      },
      headers: this.accessTokenHeader(userTokens[0])
    })
  }

  getUserValidTokens ({ id: userId }, scope = 'public') {
    return this.userTokenCollection.find({
      userId,
      scope,
      expiresAt: { $gte: new Date() }
    }).toArray()
  }

  removeExpiredTokens () {
    this.userTokenCollection.deleteMany({
      expiresAt: { $lt: new Date() }
    })
  }

  setUserToken ({ id: userId }, token, scope = 'public') {
    if (!this.userTokenCollection) { throw new Error('user token collection not set') }
    const record = {
      ...token,
      scope,
      userId,
      expiresAt: new Date(new Date().getTime() + token.expires_in * 1000)
    }
    return this.userTokenCollection.updateOne({
      userId,
      scope
    }, { $set: record }, {
      upsert: true
    })
  }

  async userOAuthCode (code, scope) {
    const res = await axios.post('https://osu.ppy.sh/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.BANCHO_V2_REDIRECT_URL
    })
      .then(res => res.data)
      .catch((error) => {
        return error.response.data
      })
    if (!res.access_token) { return false }
    const user = await this.getUserMe(undefined, {
      headers: this.accessTokenHeader(res)
    })
    return (new this.models.User(user)).setToken(res, scope)
  }

  refreshUserToken (userToken) {
    return axios.post('https://osu.ppy.sh/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: userToken.refresh_token
    }, {
      headers: this.publicTokenHeader()
    }).then(res => res.data)
  }

  getMatch (id) {
    return axios.get(`${this.apiBase}/matches/${id}`, {
      headers: this.publicTokenHeader()
    }).then(res => res.data)
  }
}

module.exports = BaseApiV2
