import express, {json} from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

import { PORT, SECRET_JWT_KEY } from './config.js'
import { userRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(json())

app.use( (req, res, next) => {
    const token =req.cookies.access_token
    req.session = {user: null}

    try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
    } catch (error) {
        req.session.user = null
    }

    next()
})

app.get('/', (req, res) => {
    const {user} = req.session
    res.render('index', {user})
})

app.post('/login', async (req, res) =>{
    const {username, password} = req.body
    try {
        const user = await userRepository.login({username, password})
        const token = jwt.sign({id: user._id, username: user.user},
            SECRET_JWT_KEY,
            {
                expiresIn: '1h'
            })
        res.cookie('access_token', token, {
            httpOnly: true, // la cookie solo se puede acceder en el servidor
            secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en el servidor
            sameSite: 'strict', // La cookie solo se puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60 // La cookie tiene un tiempo de validez de 1 hora
        }).send({username: user.username})
    } catch (error) {
        res.status(401).send(error.message)
    }
})

app.post('/register',async (req, res) => {
    const { username, password } = req.body
    try {
        const id = await userRepository.create({username, password})
        res.send({ id })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/logout', (req, res) => {
    res.clearCookie('access_token')
    .json({message: 'Logout succesful'})
})

app.get('/protected', (req, res) => {
    const {user} = req.session
    if (!user) {
        return res.status(403).send('Access not authorized')
    }
    res.render('protected', {user})
})

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
