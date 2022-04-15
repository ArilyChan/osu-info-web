const axios = require('axios')
const FormData = require('form-data')
const MongoClient = require('mongodb').MongoClient
const BaseApiV2 = require('./BaseApiV2')

class BanchoApi extends BaseApiV2 {
  constructor ({ clientId, clientSecret }) {
    super({ apiBase: 'https://osu.ppy.sh/api/v2', OAuthBase: 'https://osu.ppy.sh/oauth', models: { User: require('../model/BanchoUser') } })
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async initPublicToken () {
    const formData = new FormData()
    Object.entries({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: 'public'
    }).map(([key, value]) => formData.append(key, value))
    const result = await axios.post(`${this.OAuthBase}/token`, formData, {
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
  }

  async initUserTokens () {
    if (!process.env.DB_URI) {
      // eslint-disable-next-line no-console
      console.warn('database uri is not set. data requires user auth will not be available.\nadd DB_URI=<mongodb database connection string>, TOKEN_DATABASE=<database name>, TOKEN_COLLECTION=<collection name> to your .env configure')
      return
    }
    if (!this.userTokenCollection) {
      const client = await MongoClient.connect(process.env.DB_URI || 'mongodb://localhost:27017', { useUnifiedTopology: true })
      const db = client.db(process.env.TOKEN_DATABASE || 'osu-info-web')
      this.userTokenCollection = db.collection(process.env.TOKEN_COLLECTION || 'bancho-tokens')
    }

    const tokens = await this.userTokenCollection.find({
      expiresAt: { $gte: new Date() }
    }).toArray()

    Promise.all(tokens.map((token) => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          resolve(await this.refreshUserToken(token))
        }, token.expiresAt.getTime() - new Date().getTime() - 1000 * 60)
      })
    }))
  }

  async init () {
    await this.initPublicToken()
    await this.initUserTokens()
    this.reTokenTimeout = setTimeout(() => {
      this.init()
    }, (this.expiresIn - 60) * 1000)
  }

  publicTokenHeader () {
    return {
      Authorization: `${this.tokenType} ${this.accessToken}`
    }
  }

  accessTokenHeader (token) {
    return {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  }
}

// module.exports = BanchoApi
const bancho = new BanchoApi({
  clientId: process.env.BANCHO_API_V2_CLIENTID,
  clientSecret: process.env.BANCHO_API_V2_CLIENTSECRET
})
bancho.init()

module.exports = bancho
