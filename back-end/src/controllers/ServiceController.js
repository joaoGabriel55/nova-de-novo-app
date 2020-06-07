import models, { sequelize } from '../models';
import { Exception } from '../exceptions/responseException'

const validateService = (res, service) => {
    if (!service.name || service.name === '')
        return Exception(res, 400, 'Name is required')

    if (!service.price)
        return Exception(res, 400, 'Price is required')

    if (!service.serviceOrderId)
        return Exception(res, 400, 'Service order ID is required')

}

const index = async (req, res) => {
    try {
        const orderByPrice = req.query.orderByPrice

        const services = await models.Service.findAll({
            order: orderByPrice ? [['price', orderByPrice.toUpperCase()]] : []
        })

        return res.json(services)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service')
    }
}

const findById = async (req, res) => {
    const idRequest = parseInt(req.params.id)
    try {
        const serviceFound = await models.Service.findOne({ where: { id: idRequest } })
        if (!serviceFound)
            return Exception(res, 404, `Service  ${idRequest} not found`)
        return res.json(serviceFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service')
    }
}

const store = async (req, res) => {
    const { name, price, serviceOrderId } = req.body

    const service = { name, price, serviceOrderId }

    const error = validateService(res, service)
    if (error)
        return error

    try {
        await models.Service.create(service);
        return res.status(201).json({ name, price })
    } catch (error) {
        return Exception(res, 500, 'Error to create new Service')
    }
}

const update = async (req, res) => {
    const { id, name, price, serviceOrderId } = req.body
    const idRequest = req.params.id

    console.log(idRequest, id)

    if (parseInt(idRequest) !== id)
        return Exception(res, 400, 'Path ID and payload ID does not matches')

    const service = { id, name, price, serviceOrderId }

    if (!await models.Service.findOne({ where: { id: id } }))
        return Exception(res, 404, 'Service not found')

    const error = validateService(res, service)
    if (error)
        return error

    try {
        await models.Service.update(service, { where: { id: id } })
        return res.status(200).json({ name, price })
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to update Service')
    }
}

const destroy = async (req, res) => {
    const idRequest = parseInt(req.params.id)

    if (!await models.Service.findOne({ where: { id: idRequest } }))
        return Exception(res, 404, 'Service not found')

    try {
        await models.Service.destroy({ where: { id: idRequest } })
        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to remove Service')
    }
}

export default { index, findById, store, update, destroy }