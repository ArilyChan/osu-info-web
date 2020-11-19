const express = require('express')
const router = express.Router()

const User = require('./controller/UserController')

router.get('/users/:handle/:mode?', async (req, res, next) => {
  return res.json(await User.getUserInfo(req.params.handle, req.params.mode))
})

router.get('/recent/:handle/:mode?', async (req, res, next) => {
  return res.json(await User.recentPlay(req.params.handle, req.params.mode))
})

router.get('/clientOAuth/code', async (req, res, next) => {
  const code = req.query.code
  const state = JSON.parse(req.query.state)
  const { scope } = state

  res.json(await User.OAuthCode(code, scope))
})

module.exports = router
