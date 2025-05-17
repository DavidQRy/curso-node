const express = require('express')
const movies = require('./movies.json')

const PORT = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by') // deshanilita el header x-porwered-by: express

app.get('/', (req, res) => {
  res.json({ menssage: 'hola mundo' })
})

app.get('/movies', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
