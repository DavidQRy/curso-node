import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'db_movie'
}

const connection = await mysql.createConnection(config)

// Verificar la conexión
// connection.connect((err) => {
//   if (err) {
//     console.error('❌ Error al conectar a MySQL:', err.message)
//   } else {
//     console.log('✅ Conexión exitosa a MySQL')
//   }
// })
// connection.connect()

export class MovieModel {
  static async getAll ({ genre }) {
    // OBTENER TODAS LAS PELÍCULAS
    const [movies] = await connection.query(`
  SELECT 
  movie.id, 
  movie.title, 
  movie.year,
  movie.director, 
  movie.duration, 
  movie.poster, 
  movie.rate
  FROM movie 
  `)

    // OBTENER TODOS LOS GÉNEROS (sin WHERE)
    const [genres] = await connection.query(`
    SELECT 
    movie_genres.movie_id AS id, 
    genre.name AS genre 
    FROM movie_genres 
    JOIN genre ON movie_genres.genre_id = genre.id
    `)

    const movieWithGenre = movies.map((m) => {
      // Filtrar los géneros de esta película
      const movieGenres = genres
        .filter(g => g.id === m.id) // Solo los géneros de esta película
        .map(g => g.genre) // Extrae solo el nombre del género

      return {
        ...m,
        genres: movieGenres // Aquí sí es un array correcto de strings
      }
    })
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      return movieWithGenre.filter(m =>
        m.genres.some(g => g.toLowerCase() === lowerCaseGenre)
      )
    }

    return movieWithGenre
  }

  static async getById ({ id }) {
  // Obtener la película
    const [movies] = await connection.query(`
    SELECT 
      movie.id, 
      movie.title, 
      movie.year,
      movie.director, 
      movie.duration, 
      movie.poster, 
      movie.rate
    FROM movie
    WHERE movie.id = ? 
  `, [id])

    const movie = movies[0]
    if (!movie) return null // Si no existe, devolvemos null

    // Obtener los géneros
    const [genres] = await connection.query(`
    SELECT 
      movie_genres.movie_id AS id, 
      genre.name AS genre 
    FROM movie_genres 
    JOIN genre ON movie_genres.genre_id = genre.id 
    WHERE movie_genres.movie_id = ?
  `, [id])

    const genreNames = genres.map(g => g.genre)

    return {
      ...movie,
      genres: genreNames
    }
  }

  static async create ({ input }) {
    const {
      genre, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    try {
    // Obtener todos los géneros disponibles
      const [genreDB] = await connection.query('SELECT id, name FROM genre')

      // Convertimos los nombres a IDs usando coincidencia por nombre
      const genreIDs = genre.map((g) => {
        const match = genreDB.find(dbGenre => dbGenre.name.toLowerCase() === g.toLowerCase())
        return match?.id // si no hay coincidencia, será undefined
      }).filter(Boolean) // quitamos undefined

      if (genreIDs.length === 0) {
        throw new Error('Ningún género válido fue proporcionado')
      }

      // Generar UUID
      const [uuidResult] = await connection.query('SELECT UUID() uuid;')
      const [{ uuid }] = uuidResult

      // Insertar la película
      await connection.query(`
      INSERT INTO movie (id, title, year, director, duration, poster, rate)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `, [uuid, title, year, director, duration, poster, rate])

      // Insertar géneros asociados
      for (const id of genreIDs) {
        await connection.query(`
        INSERT INTO movie_genres (movie_id, genre_id)
        VALUES (?, ?)`, [uuid, id])
      }

      // Obtener la película insertada
      const [movies] = await connection.query(`
      SELECT id, title, year, director, duration, poster, rate
      FROM movie WHERE id = ?`, [uuid])

      const movie = movies[0]
      if (!movie) return null

      // Obtener los géneros asociados
      const [genres] = await connection.query(`
      SELECT genre.name AS genre
      FROM movie_genres
      JOIN genre ON movie_genres.genre_id = genre.id
      WHERE movie_genres.movie_id = ?`, [uuid])

      const genreNames = genres.map(g => g.genre)

      return {
        ...movie,
        genres: genreNames
      }
    } catch (e) {
      console.error(e)
      throw new Error('Error creating movie')
    }
  }

  static async delete ({ id }) {
    try {
    // Verificar si la película existe
      const [movie] = await connection.query(`
      SELECT id FROM movie WHERE id = ?`, [id])

      if (movie.length === 0) return false // no existe

      // Eliminar los géneros asociados primero (si no hay ON DELETE CASCADE)
      await connection.query(`
      DELETE FROM movie_genres WHERE movie_id = ?`, [id])

      // Eliminar la película
      await connection.query(`
      DELETE FROM movie WHERE id = ?`, [id])

      return true // eliminación exitosa
    } catch (err) {
      console.error('Error deleting movie:', err)
      throw new Error('Could not delete movie')
    }
  }

  static async updateMovie ({ id, input }) {
    const allowedFields = ['title', 'year', 'duration', 'director', 'rate', 'poster']
    const fields = []
    const values = []

    for (const key of allowedFields) {
      if (input[key] !== undefined) {
        fields.push(`${key} = ?`)
        values.push(input[key])
      }
    }

    if (fields.length === 0) return { message: 'No valid fields to update' }

    const query = `
    UPDATE movie
    SET ${fields.join(', ')}
    WHERE id = ?
  `

    values.push(id) // ID va al final

    // Ejecutamos el UPDATE
    await connection.query(query, values)

    // Consultamos la película actualizada
    const [movies] = await connection.query(`
    SELECT id, title, year, director, duration, poster, rate
    FROM movie
    WHERE id = ?`, [id])

    const movie = movies[0]
    if (!movie) return null

    // Obtenemos los géneros
    const [genres] = await connection.query(`
    SELECT genre.name AS genre
    FROM movie_genres
    JOIN genre ON movie_genres.genre_id = genre.id
    WHERE movie_genres.movie_id = ?`, [id])

    const genreNames = genres.map(g => g.genre)

    return {
      ...movie,
      genres: genreNames
    }
  }
}
