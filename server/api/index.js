const express = require('express')
const moment = require('moment')
const router = express.Router()

const User = require('./controller/UserController')
const Public = require('./controller/PublicController')
// const UserModel = require('./model/User')

router.get('/users/:handle/:mode?', async (req, res, next) => {
  return res.json(await User.getUserInfo(req.params.handle, req.params.mode))
})

router.get('/recent/:handle/:mode?', async (req, res, next) => {
  return res.json(await User.recentPlay(req.params.handle, req.params.mode))
})
router.get('/scores/:mode/:id?', async (req, res, next) => {
  return res.json(await Public.getScore(req.params.mode, req.params.id))
})

router.get('/best/:handle/:mode?', async (req, res, next) => {
  return res.json(await User.bestPlay(req.params.handle, req.params.mode, {
    startDate: req.query.start ? moment(req.query.start).toDate() : undefined,
    endDate: req.query.end ? moment(req.query.end).toDate() : undefined,
    startHoursBefore: req.query.startHoursBefore,
    endHoursBefore: req.params.endHoursBefore
  }))
})

router.get('/clientOAuth/code', async (req, res, next) => {
  const code = req.query.code
  const state = JSON.parse(req.query.state)
  const { scope } = state

  res.json(await User.OAuthCode(code, scope))
})

router.use('/broker/osu-api-v2/public', require('./broker/osu-api-v2-public'))

module.exports = router
