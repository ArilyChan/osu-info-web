const web = require('./server/app')
module.exports.name = 'stat-me'
module.exports.webView = (options, storage) => {
  return web.app
}
module.exports.apply = (app, options, storage) => {
  app.middleware((meta, next) => {
    if (!meta.message.startsWith('!!stat')) { return next() }
    const username = meta.message.slice(6).trim()
    console.log(username)
  })
}
