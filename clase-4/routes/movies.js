import { Router } from 'express'
import { MovieContorller } from '../controllers/movie.js'

export const moviesRouter = Router()

moviesRouter.get('/', MovieContorller.getAll)

moviesRouter.get('/:id', MovieContorller.getID)

moviesRouter.post('/', MovieContorller.create)

moviesRouter.delete('/:id', MovieContorller.deleteMovie)

moviesRouter.patch('/:id', MovieContorller.updateMovie)

/* moviesRouter.options('/:id', (req, res) => {
      const origin = req.header('origin')

      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', '*') // O específica el dominio exacto
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      }
      res.sendStatus(200) // Debe ser sendStatus, no send
    }) */
