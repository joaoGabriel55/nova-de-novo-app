import bcrypt from 'bcrypt'
import models, { sequelize } from '../models';
import { Exception } from '../exceptions/responseException'

const salt = 10
// index, show, store, update, destroy

const index = async (req, res) => {
}

const findByUsername = async (req, res) => {
    const username = req.params.username
    let user = await models.User.findByLogin(username)
    
    if (!user)
        return Exception(res, 400, `User '${username}' not found`)
    
    return res.status(200).json({ username: user.username })
}

const store = async (req, res) => {
    const { username, email, password } = req.body
    let user = await models.User.findByLogin(username)
    if (user)
        return Exception(res, 400, `User '${username}' already exists!`)

    let passwordHash = bcrypt.hashSync(password, salt);

    await models.User.create({ username, email, password: passwordHash });
    return res.status(201).json({ username, email })
}

const update = async (req, res) => {
}

const destroy = async (req, res) => {
}

export default { index, findByUsername, store, update, destroy }
