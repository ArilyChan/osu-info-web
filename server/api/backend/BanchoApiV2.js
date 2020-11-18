const axios = require('axios')
const FormData = require('form-data')

class BanchoApi {
  constructor ({ clientId, clientSecret }) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async init () {
    const formData = new FormData()
    Object.entries({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: 'public'
    }).map(([key, value]) => formData.append(key, value))
    const result = await axios.post('https://osu.ppy.sh/oauth/token', formData, {
      headers: formData.getHeaders()
    })
      .then(res => res.data)
      .catch((err) => {
        if (err.response.status === 401) { throw new Error('auth failed') }
        return undefined
      })
    if (!result) { return }
    this.tokenType = result.token_type
    this.expiresIn = result.expires_in
    this.accessToken = result.access_token
    this.reTokenTimeout = setTimeout(() => {
      this.init()
    }, this.expiresIn * 1000 - 60)
  }

  tokenHeader () {
    return {
      Authorization: `${this.tokenType} ${this.accessToken}`
    }
  }

  getUser (handle, mode) {
    return axios.get(`https://osu.ppy.sh/api/v2/users/${handle}${mode ? `/${mode}` : ''}`, {
      headers: this.tokenHeader()
    }).then(res => res.data)
  }

  getUserActivity (user, limit = 20, start = 0) {
    return axios.get(`https://osu.ppy.sh/api/v2/users/${user.id}/recent_activity`, {
      params: {
        limit,
        offset: start
      },
      headers: this.tokenHeader()
    }).then(res => res.data)
  }

  getUserKudosu (user, limit = 20, start = 0) {
    return axios.get(`https://osu.ppy.sh/api/v2/users/${user.id}/kudosu`, {
      params: {
        limit,
        offset: start
      },
      headers: this.tokenHeader()
    }).then(res => res.data)
  }
}

module.exports = BanchoApi
