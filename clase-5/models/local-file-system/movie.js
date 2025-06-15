import { readJSON } from '../../utils/require.js'
import { randomUUID } from 'crypto'
const movies = readJSON('../movies.json')

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return movies
  }

  static getById = async ({ id }) => {
    return movies.find(movie => movie.id === id)
  }

  static create = async (input) => {
    const newMovie = {
      id: randomUUID(), // uuuid
      ...input
    }
    // Esto no sería REST, porque estamos guardando
    // El estado de la aplicacion
    movies.push(newMovie)
    return newMovie
  }

  static deleteMovie = async ({ id }) => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    movies.splice(movieIndex, 1)
    return true
  }

  static updateMovie = async ({ id, input }) => {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return { message: 'Movie not found' }

    const updateMovie = {
      ...movies[movieIndex],
      ...input.data
    }

    movies[movieIndex] = updateMovie
    return movies[movieIndex]
  }
}
