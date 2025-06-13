// import { MovieModel } from '../models/movie.js'
import { MovieModel } from '../models/mysql/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movie.js'

export class MovieContorller {
  static async getAll (req, res) {
    const { genre } = req.query
    res.json(await MovieModel.getAll({ genre }))
  }

  static async getID (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ menssage: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }
    res.status(201).json(await MovieModel.create({ input: result.data }))
  }

  static async deleteMovie (req, res) {
    const { id } = req.params
    const result = await MovieModel.deleteMovie({ id })
    if (result === false) return res.status(404).json({ message: 'Movie not found' })
    if (result === true) return res.status(204).json({ message: 'Movie delete' })
  }

  static async updateMovie (req, res) {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    return res.json(await MovieModel.updateMovie({ id, input: result.data }))
  }
}
