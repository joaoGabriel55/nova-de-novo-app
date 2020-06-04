import models, { sequelize } from '../models';
import { validateEmail, validatePhone } from '../utils/validatorUtils'
import { Exception } from '../exceptions/responseException'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const validateCustomer = (res, customer) => {

    if (!customer.name || customer.name === '')
        return Exception(res, 400, 'Name is required')

    if (!customer.phone || customer.phone === '')
        return Exception(res, 400, 'Phone is required')


    if (!validatePhone(customer.phone))
        return Exception(res, 400, 'Phone is not valid')

    if (!customer.email || customer.email === '')
        return Exception(res, 400, 'Email is required')

    if (!validateEmail(customer.email))
        return Exception(res, 400, 'Email is not valid')

    if (!customer.address || customer.address === '')
        return Exception(res, 400, 'Address is required')

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
        const customers = await models.Customer.findAndCountAll(
            {
                order: orderBy ? [['name', orderBy.toUpperCase()]] : [],
                where: selector,
                limit: limit,
                offset: offset,
            }
        )
        return res.json(customers)
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to retrieve Customers')
    }

}

const findById = async (req, res) => {
    const idRequest = parseInt(req.params.id)
    try {
        const customerFound = await models.Customer.findOne({ where: { id: idRequest, active: true } })
        if (!customerFound)
            return Exception(res, 404, `Customer ${idRequest} not found`)
        return res.json(customerFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Customer')
    }
}

const store = async (req, res) => {
    const { name, phone, email, address } = req.body

    validateCustomer(res, { name, phone, email, address })

    const customer = { name, phone, email, address, active: true }

    try {
        await models.Customer.create(customer);
        return res.status(201).json({ name })
    } catch (error) {
        return Exception(res, 500, 'Error to create new Customer')
    }
}

const update = async (req, res) => {

    const { id, name, phone, email, address } = req.body
    const idRequest = req.params.id

    console.log(idRequest, id)

    if (parseInt(idRequest) !== id)
        return Exception(res, 400, 'Path ID and payload ID does not matches')

    if (!await models.Customer.findOne({ where: { id: id, active: true } }))
        return Exception(res, 404, 'Customer not found')

    validateCustomer(res, { name, phone, email, address })

    try {
        await models.Customer.update(
            { name, phone, email, address },
            { where: { id: id } }
        )
        return res.status(200).json({ name })
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to update Customer')
    }

}

const destroy = async (req, res) => {
    const idRequest = parseInt(req.params.id)

    if (!await models.Customer.findOne({ where: { id: idRequest, active: true } }))
        return Exception(res, 404, 'Customer not found')

    try {
        await models.Customer.update(
            { active: false },
            { where: { id: idRequest } }
        )
        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to remove Customer')
    }
}

export default { index, findById, store, update, destroy }