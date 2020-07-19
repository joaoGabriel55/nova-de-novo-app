import { API } from '../Api'
import jwt from 'jsonwebtoken'
const dotenv = require('dotenv');
dotenv.config()

export const userLogin = (userCrendentials) => {
    const secret = process.env.REACT_APP_TOKEN_SECRET
    userCrendentials.password = jwt.sign(
        { passwordHash: userCrendentials.password }, secret, { expiresIn: '120s' }
    )
    return API.post('/auth/login', userCrendentials)
}