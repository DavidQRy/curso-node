const express = require('express')
const crypto = require('crypto')
const movies = require('./movies.json')

const { validateMovie, validatePartialMovie } = require('./schemas/movie')

const PORT = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by') // deshanilita el header x-porwered-by: express
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*') // O específica el dominio exacto
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
//   next()
// })

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ menssage: 'hola mundo' })
})

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'http://localhost:5500',
  'http://127.0.0.1:3000'
]

app.get('/movies', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) { res.header('Access-Control-Allow-Origin', origin) }
  console.log(req.body, 'peticion')
  const { genre } = req.query
  if (genre) {
    const filterMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    res.json(filterMovies)
  } else {
    res.json(movies)
  }
  // leer el query param de format
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ menssage: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message)
    })
  }
  const newMovie = {
    id: crypto.randomUUID(), // uuuid
    ...result.data
  }
  // Esto no sería REST, porque estamos guardando
  // El estado de la aplicacion
  movies.push(newMovie)
  res.status(201).json(newMovie)
  console.log(result)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  console.log(req)
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  movies.splice(movieIndex, 1)
  return res.status(204).send()
})

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', '*') // O específica el dominio exacto
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  res.sendStatus(200) // Debe ser sendStatus, no send
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
