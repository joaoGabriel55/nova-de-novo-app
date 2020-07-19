import { API } from '../Api'
import jwt from 'jsonwebtoken'
const dotenv = require('dotenv');
dotenv.config()

export const userLogin = (userCrendentials) => {
    const secret = process.env.REACT_APP_TOKEN_SECRET
    console.log(userCrendentials)
    userCrendentials.password = jwt.sign(
        { passwordHash: userCrendentials.password }, secret, { expiresIn: '120s' }
    )
    console.log(userCrendentials)
    return API.post('/auth/login', userCrendentials)
}