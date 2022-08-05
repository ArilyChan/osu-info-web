const express = require('express')
const app = express()

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}
// app.use(express.static('../static'))
// app.use((req, res, next) => {
//   console.log(req.url)
//   next()
// })
app.use('/api', require('./api/index.cjs'))

module.exports = app
