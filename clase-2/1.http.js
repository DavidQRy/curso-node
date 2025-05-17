const http = require('http')

const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  console.log('request received:', req.url)
  res.setHeader('Content-Type', 'text/html; charset=utf-8;')
  if (req.url === '/') {
    res.statusCode = 200
    res.end('<h1>Bienvenido a mi página de inicio!!!!!!!!!!!!</h1>')
  } else if (req.url === '/imagen.png') {
    res.statusCode = 200
    fs.readFile('./image.png', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h2>Error al buscar la imagen</h2>')
        res.end('Error 500')
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.statusCode = 200
    res.end('Contacto')
  } else {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<h1>404</h1> \n <h2>La pagina no fue Encontrada<h2>')
  }
}
const server = http.createServer(processRequest)
server.listen(desiredPort, () => { // <-- Aquí está el cambio importante
  console.log(`server listening on port http://localhost:${desiredPort}`)
})
