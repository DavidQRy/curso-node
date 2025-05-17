const http = require('http')
const { findAvailablePort } = require('./10.free-port')

const desiredPort = process.env.PORT ?? 3000

const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('Esto es un server montado en node js')
})

findAvailablePort(desiredPort).then(port => {
  server.listen(port, () => { // <-- Aquí está el cambio importante
    console.log(`server listening on port http://localhost:${port}`)
  })
})

// Alternativa con puerto 0 (aleatorio)
/* server.listen(0, () => {
  console.log(`server listening on port http://localhost:${server.address().port}`);
}); */
