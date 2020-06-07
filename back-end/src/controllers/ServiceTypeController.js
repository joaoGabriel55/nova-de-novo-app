import models, { sequelize } from '../models';
import { Exception } from '../exceptions/responseException'

const validateService = (res, service) => {
    if (!service.name || service.name === '')
        return Exception(res, 400, 'Name is required')
}

const index = async (req, res) => {
    try {
        const services = await models.ServiceType.findAll({})
        return res.json(services)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service type')
    }
}

const findById = async (req, res) => {
    const idRequest = parseInt(req.params.id)
    try {
        const serviceFound = await models.ServiceType.findOne({ where: { id: idRequest } })
        if (!serviceFound)
            return Exception(res, 404, `Service type ${idRequest} not found`)
        return res.json(serviceFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service type')
    }
}

const store = async (req, res) => {
    const { name } = req.body

    const service = { name }

    validateService(res, service)

    try {
        await models.ServiceType.create(service);
        return res.status(201).json({ name })
    } catch (error) {
        return Exception(res, 500, 'Error to create new Service type')
    }
}

const update = async (req, res) => {
    const { id, name } = req.body
    const idRequest = req.params.id

    console.log(idRequest, id)

    if (parseInt(idRequest) !== id)
        return Exception(res, 400, 'Path ID and payload ID does not matches')

    const service = { id, name }

    if (!await models.ServiceType.findOne({ where: { id: id } }))
        return Exception(res, 404, 'Service type not found')

    validateService(res, service)

    try {
        await models.ServiceType.update(service, { where: { id: id } })
        return res.status(200).json({ name, price })
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to update Service type')
    }
}

const destroy = async (req, res) => {
    const idRequest = parseInt(req.params.id)

    if (!await models.ServiceType.findOne({ where: { id: idRequest } }))
        return Exception(res, 404, 'Service type not found')

    try {
        await models.ServiceType.destroy({ where: { id: idRequest } })
        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to remove Service type')
    }
}

export default { index, findById, store, update, destroy }