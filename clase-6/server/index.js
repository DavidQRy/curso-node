import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  host: process.env.HOST,
  user: process.env.USERDB,
  port: process.env.PORTDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

const connection = await mysql.createConnection(config)

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

io.on('connection', async (socket) => {
  console.log('a user has conencted!')

  socket.on('disconnect', () => {
    console.log('an user has disconnected')
  })
  socket.on('Chat message', async (msg) => {
    const user = socket.handshake.auth.username ?? 'anonymous'
    try {
      const [result] = await connection.query(`
      INSERT INTO message (message, username) VALUES (?, ?)
    `, [msg, user])

      console.log(result)

      // Aquí usamos result.insertId correctamente
      io.emit('Chat message', msg, result.insertId.toString(), user)
    } catch (e) {
      console.error('Error al insertar mensaje:', e)
      // Opcional: notificar al usuario del error
      socket.emit('chat_error', 'No se pudo enviar el mensaje')
    }
  })
  if (!socket.recovered) {
    try {
      const [results] = await connection.query(`
        SELECT id, message, username FROM message WHERE id > ?
        `, [socket.handshake.auth.serverOffset ?? 0])
      results.forEach(row => {
        socket.emit('Chat message', row.message, row.id.toString(), row.username)
      })
    } catch (error) {
      console.log(error)
    }
  }
})
app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
