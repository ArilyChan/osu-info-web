const express = require('express')
const app = express()

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}
// app.use(express.static('../static'))
app.use('/api', require('./api'))

module.exports = app
