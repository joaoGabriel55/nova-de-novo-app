import models, { sequelize } from '../models';
import { Exception } from '../exceptions/responseException'

// index, show, store, update, destroy

const index = async (req, res) => {
    return res.json('USER')
}

const store = async (req, res) => {
    const { username, email } = req.body
    let user = await models.User.findByLogin(username)
    if (user)
        return Exception(res, 400, `User '${username}' already exists!`)

    user = await models.User.create({ username, email });
    return res.json(user)
}

const update = async (req, res) => {
}

const destroy = async (req, res) => {
}

export default { index, store, update, destroy }
