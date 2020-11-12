
const express = require('express')
const app = express()
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

// 用指定的配置对象实例化 Nuxt.js
const config = require('../nuxt.config.js')
config.dev = !isProd

app.use(express.static('../static'))
app.use('/api', require('./api'))

listen()
function listen () {
  // 服务端监听
  app.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}
