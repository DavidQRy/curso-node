const net = require('node:net')

// Función para encontrar un puerto disponible
function findAvailablePort (desiredPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      const port = server.address().port
      server.close(() => {
        resolve(port)
      })
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(0).then(resolve).catch(reject) // Recursión si el puerto está ocupado
      } else {
        reject(err)
      }
    })
  })
}

module.exports = { findAvailablePort }
