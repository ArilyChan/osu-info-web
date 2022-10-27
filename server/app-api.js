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

  function shutdown (event, origin) {
    console.log(event, origin)
    console.trace('Cause:')
    server.close()
    process.exit()
  }
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, (...args) => shutdown(eventType, args))
  })
  const orig = process._fatalException

  process._fatalException = (...args) => {
    console.log(args)
    return orig.bind(process, args)
  }
}

// app.use(require('./errorHandler'))
