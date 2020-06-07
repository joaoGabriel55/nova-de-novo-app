import models, { sequelize } from '../models';
import { validateEmail, validatePhone } from '../utils/validatorUtils'
import { Exception } from '../exceptions/responseException'


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

    if (!dressmaker.email || dressmaker.email === '')
        return Exception(res, 400, 'Email is required')

    if (!validateEmail(dressmaker.email))
        return Exception(res, 400, 'Email is not valid')

    if (!dressmaker.address || dressmaker.address === '')
        return Exception(res, 400, 'Address is required')

    if (!dressmaker.contract || dressmaker.contract === '')
        return Exception(res, 400, 'Contract type is required')

    if (!(dressmaker.contract.toUpperCase() === contractType.pj) && !(dressmaker.contract.toUpperCase() === contractType.clt))
        return Exception(res, 400, 'Contract type is must be \'CLT\' or \'PJ\'')
}

const index = async (req, res) => {
    if (!(req.query.hasOwnProperty('limit') && req.query.hasOwnProperty('offset')))
        return Exception(res, 400, 'This request must be contains limit and offset')

    const orderBy = req.query.orderBy
    const like = req.query.like
    const limit = req.query.limit
    const offset = req.query.offset

    const selector = like ? {
        name: {
            [Op.like]: `%${like}%`
        },
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
    const { name, phone, email, address, contract } = req.body
    const dressmaker = {
        name, phone, email, address, contract, admission: new Date(), active: true
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
    const { id, name, phone, email, address, contract } = req.body
    const dressmaker = {
        id, name, phone, email, address, contract
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