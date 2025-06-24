import express, {json} from 'express'

import { PORT } from './config.js'

const app = express()

app.use(json())

app.get('/', (req, res) => {
    res.send('Hello word')
})

app.post('/login', async (req, res) =>{
    const { user } = req.body
    res.json({
        user: user
    })
})

app.post('/register', (req, res) => {

})

app.post('/logout', (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
