const express = require('express')
const moment = require('moment')
const router = express.Router()

const BanchoUser = require('./controller/BanchoUserController')
const BanchoPublic = require('./controller/BanchoPublicController')

const PpySbUser = require('./controller/PpySbUserController')
const PpySbPublic = require('./controller/PpySbPublicController')
// const UserModel = require('./model/User')
const servers = {
  bancho: {
    User: BanchoUser,
    Public: BanchoPublic
  },
  sb: {
    User: PpySbUser,
    Public: PpySbPublic
  }
}

const getServer = (server) => {
  return servers[server || 'bancho']
}
router.get('/users/:handle/:mode?', async (req, res, next) => {
  const { User } = getServer(req.query.server)
  try {
    return res.json(await User.getUserInfo(req.params.handle, req.params.mode))
  } catch (error) {
    res.json({ error })
  }
})

router.get('/recent/:handle/:mode?', async (req, res, next) => {
  const { User } = getServer(req.query.server)
  return res.json(await User.recentPlay(req.params.handle, req.params.mode))
})
router.get('/scores/:mode/:id', async (req, res, next) => {
  const { Public } = getServer(req.query.server)
  try {
    return res.json(await Public.getScore(req.params.mode, req.params.id))
  } catch (err) {
    console.error(err.message, err.stack)
  }
})

router.get('/best/:handle/:mode?', async (req, res, next) => {
  const { User } = getServer(req.query.server)
  return res.json(await User.bestPlay(req.params.handle, req.params.mode, {
    startDate: req.query.start ? moment(req.query.start).toDate() : undefined,
    endDate: req.query.end ? moment(req.query.end).toDate() : undefined,
    startHoursBefore: req.query.startHoursBefore,
    endHoursBefore: req.params.endHoursBefore
  }))
})

router.get('/matches/:id', async (req, res, next) => {
  if (!parseInt(req.params.id)) { return res.status(500).json({ error: 'match ID invalid' }) }
  return res.json(await BanchoPublic.getMatchInfo(req.params.id))
})

router.get('/clientOAuth/code', async (req, res, next) => {
  const code = req.query.code
  const state = JSON.parse(req.query.state)
  const { scope } = state

  res.json(await BanchoUser.OAuthCode(code, scope))
})

router.use('/broker/osu-api-v2/public', require('./broker/osu-api-v2-public'))
router.use((err, req, res, next) => {
  res.status(500)
  res.json(err)
})

module.exports = router
