const moment = require('moment')
const axios = require('axios')
class MotherShip {
  getUserHistory ({ id }, start = new Date(), limit = 0) {
    const dateStr = moment(start).format('YYYYMMDD')
    if (!limit) { limit = Math.ceil((new Date() - start) / (1000 * 3600 * 24)) - 1 }
    if (!limit) { limit = 1 }
    return axios.get(`https://www.mothership.top/api/v1/userinfo/${id}`, {
      params: {
        start: dateStr,
        limit
      }
    }).then(res => res.data).then(res => res.data).then(res => res.filter(r => r !== null))
  }
}

module.exports = MotherShip
