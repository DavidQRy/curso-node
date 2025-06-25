import express, {json} from 'express'

import { PORT } from './config.js'
import { userRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')
app.use(json())

app.get('/', (req, res) => {
    res.render('examples', {username: 'David'})
})

app.post('/login', async (req, res) =>{
    const {username, password} = req.body
    try {
        const user = await userRepository.login({username, password})
        res.render('examples', {username: 'David'})
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

})

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
