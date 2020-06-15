import models, { sequelize } from '../models';
import { validatePhone } from '../utils/validatorUtils'
import { Exception } from '../exceptions/responseException'
const Sequelize = require('sequelize');

const contractType = {
    clt: 'CLT',
    pj: 'PJ'
}

const validateDressmaker = (res, dressmaker) => {

    if (!dressmaker.name || dressmaker.name === '')
        return Exception(res, 400, 'Name is required')

    if (!dressmaker.phone || dressmaker.phone === '')
        return Exception(res, 400, 'Phone is required')

    if (!validatePhone(dressmaker.phone))
        return Exception(res, 400, 'Phone is not valid')

    if (!dressmaker.address || dressmaker.address === '')
        return Exception(res, 400, 'Address is required')

    if (!dressmaker.contract || dressmaker.contract === '')
        return Exception(res, 400, 'Contract type is required')

    if (!(dressmaker.contract.toUpperCase() === contractType.pj) && !(dressmaker.contract.toUpperCase() === contractType.clt))
        return Exception(res, 400, 'Contract type is must be \'CLT\' or \'PJ\'')

    if (!dressmaker.admission || dressmaker.admission === '')
        return Exception(res, 400, 'Admission date is required')
}

const index = async (req, res) => {
    if (!(req.query.hasOwnProperty('limit') && req.query.hasOwnProperty('offset')))
        return Exception(res, 400, 'This request must be contains limit and offset')

    const orderBy = req.query.orderBy
    const like = req.query.like
    const limit = req.query.limit
    const offset = req.query.offset

    const selector = like ? {
        name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', `${like.toLowerCase()}%`),
        active: true
    } : { active: true }

    try {

        const dressmaker = await models.Dressmaker.findAndCountAll(
            {
                order: orderBy ? [['name', orderBy.toUpperCase()]] : [],
                where: selector,
                limit: limit,
                offset: offset,
            }
        )
        return res.json(dressmaker)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Customers')
    }

}

const findById = async (req, res) => {
    const idRequest = parseInt(req.params.id)
    try {
        const dressmakerFound = await models.Dressmaker.findOne({ where: { id: idRequest, active: true } })
        if (!dressmakerFound)
            return Exception(res, 404, `Dressmaker ${idRequest} not found`)
        return res.json(dressmakerFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Dressmaker')
    }
}

const store = async (req, res) => {
    const { name, phone, address, contract, admission } = req.body
    const dressmaker = {
        name, phone, address, contract, admission, active: true
    }

    const error = validateDressmaker(res, dressmaker)
    if (error)
        return error

    try {
        await models.Dressmaker.create(dressmaker);
        return res.status(201).json({ name })
    } catch (error) {
        return Exception(res, 500, 'Error to create new Dressmaker')
    }
}

const update = async (req, res) => {
    const { id, name, phone, address, contract, admission } = req.body
    const dressmaker = {
        id, name, phone, address, contract, admission
    }
    const idRequest = req.params.id

    console.log(idRequest, dressmaker.id)

    if (parseInt(idRequest) !== id)
        return Exception(res, 400, 'Path ID and payload ID does not matches')

    const selector = { where: { id: dressmaker.id, active: true } }

    if (!await models.Dressmaker.findOne(selector))
        return Exception(res, 404, 'Dressmaker not found')

    const error = validateDressmaker(res, dressmaker)
    if (error)
        return error

    try {
        await models.Dressmaker.update(dressmaker, selector)
        return res.status(200).json({ name })
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to update Dressmaker')
    }

}

const destroy = async (req, res) => {
    const idRequest = parseInt(req.params.id)
    const selector = { where: { id: idRequest, active: true } }

    if (!await models.Dressmaker.findOne(selector))
        return Exception(res, 404, 'Dressmaker not found')

    try {
        await models.Dressmaker.update({ resignation: new Date(), active: false }, selector)
        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to remove Dressmaker')
    }
}

export default { index, findById, store, update, destroy }