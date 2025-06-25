import DBLocal from 'db-local'
const { Schema } = new DBLocal ({path: './db'})
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from './config.js'

const User = Schema('User', {
    _id: {type: String, required: true},
    username: { type: String, required: true},
    password: {type: String, required: true}
})

export class userRepository {
    static async create ({ username, password }) {
        Validation.validateUsername(username)
        Validation.ValidatePassword(password)
        
        const user = User.findOne ({username})
        if(user) throw new Error('username alredy exists')
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        
        const id = crypto.randomUUID()

         await User.create({
            _id: id,
            username: username,
            password: hashedPassword
        }).save()

        return id
    }
    static async login ({username, password}) {
        Validation.validateUsername(username)
        Validation.ValidatePassword(password)

        const user = User.findOne({username})
        if (!user) throw new Error('username does not exist')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('password is invalid')
        const {password:_, ...publicUser} = user

        return publicUser
    }
}

export class Validation{
    static validateUsername (username){
        //valida el usuario
        if (typeof username !== 'string') throw new Error('username must be a string')
        if (username.length < 3) throw new Error('username must be at leats 3 characters long')
    }

    static ValidatePassword (password){
        // Valida la contraseña
        if (typeof password !== 'string') throw new Error('password must be a string')
        if (password.length < 6) throw new Error('password must be at least 6 characters long')
    }
}