import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import models, { sequelize } from '../../models';
import { Exception } from '../../exceptions/responseException'

dotenv.config();

let refreshTokens = []

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '30s' })
}

const loginUser = async (req, res) => {
    const { username, password } = req.body
    if (username === '' || !username || password === '' || !password)
        Exception(res, 400, `Inform username and password`)

    const user = await models.User.findByLogin(username)
    if (!user)
        Exception(res, 400, `User '${username}' does not exists!`)

    const passwordHash = user.password

    if (!bcrypt.compareSync(password, passwordHash))
        return Exception(res, 400, `Wrong password!`)

    const accessToken = generateAccessToken({ username })
    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)

    return res.status(200).json({ accessToken, refreshToken })
}

const accessToken = (req, res) => {
    console.log(refreshTokens);
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user })
        res.json({ accessToken: accessToken })
    })
}

const logout = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
}

export default { loginUser, accessToken, logout }