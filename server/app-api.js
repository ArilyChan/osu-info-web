require('module-alias/register')
const fs = require('fs')
const app = require('./base')
// const isProd = process.env.NODE_ENV === 'production'
const port = process.env.API_LISTEN || process.env.PORT || 3000

listen()
function listen () {
  if (process.env.API_SCHEME?.startsWith('unix') && fs.existsSync(port)) {
    fs.unlinkSync(port)
  }
  // 服务端监听
  const server = app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${port}`)

  function shutdown () {
    server.close()
    process.exit()
  }
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, shutdown.bind(null, eventType))
  })
}

// app.use(require('./errorHandler'))
