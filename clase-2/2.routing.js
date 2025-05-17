const http = require('node:http')

const dittoJSON = require('./pokemon/ditto.json')
const { stringify } = require('node:querystring')

const processRequest = (req, res) => {
  const { method, url } = req
  switch (method) {
    case 'GET':{
      switch (url) {
        case '/pokemon/ditto':{
          res.statusCode = 200
          res.setHeader('Content-type', 'application/json; charset=utf-8;')
          return res.end(stringify(dittoJSON))
        }
        default:{
          res.statusCode = 404
          res.setHeader('Content-type', 'text/html; charset=utf-8')
          return res.end('<h1>404</h1>')
        }
      }
    }
    case 'POST':{
      switch (url) {
        case '/pokemon':{
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const data = JSON.parse(body)
            data.hora = Date.now()
            res.writeHeader(201, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify(data))
          })
          break
        }
        default:{
          res.statusCode = 404
          res.setHeader('Content-type', 'text/plian; charset=utf-8')
          return res.end('404 Not Found')
        }
      }
    }
  }
}
const server = http.createServer(processRequest)

server.listen(1234, () => {
  console.log('server listen on port http://localhost:1234')
})
