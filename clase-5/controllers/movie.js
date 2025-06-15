// import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movie.js'

export class MovieContorller {
  constructor ({ MovieModel }) {
    this.MovieModel = MovieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    res.json(await this.MovieModel.getAll({ genre }))
  }

  getID = async (req, res) => {
    const { id } = req.params
    const movie = await this.MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ menssage: 'Movie not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }
    res.status(201).json(await this.MovieModel.create({ input: result.data }))
  }

  deleteMovie = async (req, res) => {
    const { id } = req.params
    const result = await this.MovieModel.deleteMovie({ id })
    if (result === false) return res.status(404).json({ message: 'Movie not found' })
    if (result === true) return res.status(204).json({ message: 'Movie delete' })
  }

  updateMovie = async (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    return res.json(await this.MovieModel.updateMovie({ id, input: result.data }))
  }
}
