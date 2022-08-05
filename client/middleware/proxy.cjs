import http from 'http'

export default async function (clientReq, clientRes) {
  const options = {
    // hostname: 'localhost',
    // port: 4743,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers
  }
  if (process.env.API_SCHEME?.startsWith('unix')) {
    options.socketPath = process.env.API_LISTEN
  } else {
    options.hostname = process.env.API_DOMAIN
    options.port = process.env.API_LISTEN
  }

  const proxy = new Promise((resolve) => {
    let str = ''
    http.request(options, function (res) {
      // clientRes.setHeader(res.headers)
      Object.entries(res.headers).forEach(([k, v]) => {
        clientRes.setHeader(k, v)
      })
      // another chunk of data has been received, so append it to `str`
      res.on('data', function (chunk) {
        str += chunk
      })
      // res.pipe(clientRes)
      res.on('end', () => {
        resolve(str)
      })
    }).end()
  })

  // clientReq.pipe(proxy)
  return await proxy
}

// proxy: {
//   // see Proxy section
//   '/api': process.env.API_SCHEME?.startsWith('unix')
//     ? {
//       changeOrigin: false,
//       target: { socketPath: process.env.API_LISTEN }
//     }
//     : {
//       changeOrigin: false,
//       target: `${process.env.API_SCHEME}${process.env.API_DOMAIN}:${process.env.API_LISTEN}`
//     }
// },
