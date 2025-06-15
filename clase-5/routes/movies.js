import { Router } from 'express'
import { MovieContorller } from '../controllers/movie.js'

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()

  const movieContorller = new MovieContorller({ MovieModel: movieModel })

  moviesRouter.get('/', movieContorller.getAll)

  moviesRouter.get('/:id', movieContorller.getID)

  moviesRouter.post('/', movieContorller.create)

  moviesRouter.delete('/:id', movieContorller.deleteMovie)

  moviesRouter.patch('/:id', movieContorller.updateMovie)
  return moviesRouter
}

/* moviesRouter.options('/:id', (req, res) => {
      const origin = req.header('origin')

      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', '*') // O específica el dominio exacto
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      }
      res.sendStatus(200) // Debe ser sendStatus, no send
    }) */
