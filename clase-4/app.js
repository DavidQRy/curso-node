import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

const PORT = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by') // deshanilita el header x-porwered-by: express

app.use(json())
app.use(corsMiddleware())
app.get('/', (req, res) => {
  res.json({ menssage: 'hola mundo' })
})

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})

// El import de el futuro es
// import movies from './movies.json' with {type: 'json'}

// Como leer un json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.setHeader('Access-Control-Allow-Origin', '*') // O específica el dominio exacto
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
//   }
//   res.sendStatus(200) // Debe ser sendStatus, no send
// })
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*') // O específica el dominio exacto
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
//   next()
// })
