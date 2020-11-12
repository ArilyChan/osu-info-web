const express = require('express')
const router = express.Router()

const User = require('./controller/UserController')

router.get('/users/:handle/:mode?', async (req, res, next) => {
  return res.json(await User.getUserInfo(req.params.handle, req.params.mode))
})

module.exports = router
