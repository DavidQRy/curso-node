const express = require('express')
const ditto = require('./pokemon/ditto.json')
const PORT = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')

app.use(express.json())

/* app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    // mutar la request
    req.body = data
    next()
  })
}) */

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/pokemon/ditto', (req, res) => {
  res.send(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
