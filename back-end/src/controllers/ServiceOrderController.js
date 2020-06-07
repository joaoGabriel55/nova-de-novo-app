import models, { sequelize } from '../models';
import { Exception } from '../exceptions/responseException'

const validateDate = (date, dataCompare) => {
    console.log(date, dataCompare)

    if (date.getTime() < dataCompare.getTime())
        return false
    return true
}

const validateServiceOrder = (res, service) => {

    if (!service.entryDate || service.entryDate === '')
        return Exception(res, 400, 'Entry date is required')

    if (!validateDate(new Date(service.entryDate), new Date()))
        return Exception(res, 400, 'Entry date is invalid')

    if (!service.deliveryDate || service.deliveryDate === '')
        return Exception(res, 400, 'Delivery date is required')

    if (!validateDate(new Date(service.deliveryDate), new Date()) ||
        !validateDate(new Date(service.deliveryDate), new Date(service.entryDate))) {
        return Exception(res, 400, 'Delivery date is invalid')
    }

    if (!service.deliveryPeriod || service.deliveryPeriod === '')
        return Exception(res, 400, 'Delivery period is required')
    if (!(service.deliveryPeriod.toUpperCase() === 'T') && !(service.deliveryPeriod.toUpperCase() === 'M'))
        return Exception(res, 400, 'Delivery period must be \'T\' or \'M\'')

    if (!service.status || service.status === '')
        return Exception(res, 400, 'Status is required')
    if (!(service.status.toUpperCase() === 'FINISHED') && !(service.status.toUpperCase() === 'PENDING'))
        return Exception(res, 400, 'Status must be \'FINISHED\' or \'PENDING\'')

    if (!service.customerId || service.customerId === '')
        return Exception(res, 400, 'Customer ID is required')
    if (!service.dressmakerId || service.dressmakerId === '')
        return Exception(res, 400, 'Dressmaker ID is required')

    if (!service.totalPrice || service.totalPrice < 0)
        return Exception(res, 400, 'Total price is required or invalid')

    return null
}

const serviceOrder = async (data) => {
    const customer = await models.Customer.findOne({ where: { id: data.customerId, active: true } })
    const dressmaker = await models.Dressmaker.findOne({ where: { id: data.dressmakerId, active: true } })

    data['customer'] = { id: customer.id, name: customer.name }
    delete data.customerId

    data['dressmaker'] = { id: dressmaker.id, name: dressmaker.name }
    delete data.dressmakerId

    return data
}

const index = async (req, res) => {
    try {
        const orderByPrice = req.query.orderByPrice

        const limit = req.query.limit
        const offset = req.query.offset

        let serviceOrders = await models.ServiceOrder.findAndCountAll(
            {
                order: orderByPrice ? [['totalPrice', orderByPrice.toUpperCase()]] : [],
                include: ['services'],
                limit: limit,
                offset: offset,
            }
        )

        for (const element of serviceOrders.rows)
            await serviceOrder(element.dataValues)

        return res.json(serviceOrders)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByCustomerId = async (req, res) => {
    const customerId = req.params.id
    const selector = { customerId: customerId }

    try {
        const orderByPrice = req.query.orderByPrice
        const limit = req.query.limit
        const offset = req.query.offset

        let serviceOrders = await models.ServiceOrder.findAndCountAll(
            {
                order: orderByPrice ? [['totalPrice', orderByPrice.toUpperCase()]] : [],
                where: selector,
                include: ['services'],
                limit: limit,
                offset: offset,
            }
        )

        for (const element of serviceOrders.rows)
            await serviceOrder(element.dataValues)

        return res.json(serviceOrders)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByDressMakerId = async (req, res) => {
    const dressmakerId = req.params.id
    const selector = { dressmakerId: dressmakerId }

    try {
        const orderByPrice = req.query.orderByPrice
        const limit = req.query.limit
        const offset = req.query.offset

        let serviceOrders = await models.ServiceOrder.findAndCountAll(
            {
                order: orderByPrice ? [['totalPrice', orderByPrice.toUpperCase()]] : [],
                where: selector,
                include: ['services'],
                limit: limit,
                offset: offset,
            }
        )

        for (const element of serviceOrders.rows)
            await serviceOrder(element.dataValues)

        return res.json(serviceOrders)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByCustomerAndDressmakerId = async (req, res) => {
    const dressmakerId = req.params.dressmakerId
    const customerId = req.params.customerId

    const selector = { dressmakerId: dressmakerId, customerId: customerId }

    try {
        const orderByPrice = req.query.orderByPrice
        const limit = req.query.limit
        const offset = req.query.offset

        let serviceOrders = await models.ServiceOrder.findAndCountAll(
            {
                order: orderByPrice ? [['totalPrice', orderByPrice.toUpperCase()]] : [],
                where: selector,
                include: ['services'],
                limit: limit,
                offset: offset,
            }
        )

        for (const element of serviceOrders.rows)
            await serviceOrder(element.dataValues)

        return res.json(serviceOrders)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findById = async (req, res) => {
    const idRequest = parseInt(req.params.id)
    try {
        let serviceOrderFound = await models.ServiceOrder.findByPk(idRequest, { include: ['services'] })

        if (!serviceOrderFound)
            return Exception(res, 404, `Service Order ${idRequest} not found`)
        serviceOrderFound = await serviceOrder(serviceOrderFound.dataValues)
        return res.json(serviceOrderFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByIdAndDressmakerId = async (req, res) => {
    const serviceOrderId = parseInt(req.params.id)
    const dressmakerId = req.params.dressmakerId

    const selector = { id: serviceOrderId, dressmakerId: dressmakerId }

    try {

        const serviceOrderFound = await models.ServiceOrder.findOne({
            include: [{
                model: models.Service,
                as: 'services'
            }],
            where: selector
        })

        if (!serviceOrderFound)
            return Exception(res, 404, `Service Order ${serviceOrderId} not found`)

        await serviceOrder(serviceOrderFound.dataValues)

        return res.json(serviceOrderFound)
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByIdAndCustomerId = async (req, res) => {
    const serviceOrderId = parseInt(req.params.id)
    const customerId = req.params.customerId

    console.log(serviceOrderId)

    const selector = { id: serviceOrderId, customerId: customerId }

    try {

        const serviceOrderFound = await models.ServiceOrder.findOne({
            include: [{
                model: models.Service,
                as: 'services'
            }],
            where: selector
        })

        if (!serviceOrderFound)
            return Exception(res, 404, `Service Order ${serviceOrderId} not found`)

        await serviceOrder(serviceOrderFound.dataValues)

        return res.json(serviceOrderFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByIdAndCustomerAndDressmakerId = async (req, res) => {
    const serviceOrderId = parseInt(req.params.id)
    const dressmakerId = req.params.dressmakerId
    const customerId = req.params.customerId

    console.log(serviceOrderId)

    const selector = { id: serviceOrderId, dressmakerId: dressmakerId, customerId: customerId }

    try {

        const serviceOrderFound = await models.ServiceOrder.findOne({
            include: [{
                model: models.Service,
                as: 'services'
            }],
            where: selector
        })

        if (!serviceOrderFound)
            return Exception(res, 404, `Service Order ${serviceOrderId} not found`)

        await serviceOrder(serviceOrderFound.dataValues)

        return res.json(serviceOrderFound)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const store = async (req, res) => {
    const { deliveryDate, entryDate, deliveryPeriod, totalPrice, status, customerId, dressmakerId } = req.body

    const serviceOrder = { deliveryDate, entryDate, deliveryPeriod, totalPrice, status, customerId, dressmakerId }

    const error = validateServiceOrder(res, serviceOrder)
    if (error)
        return error

    try {
        const result = await models.ServiceOrder.create(serviceOrder);
        return res.status(201).json(result)
    } catch (error) {
        return Exception(res, 500, 'Error to create new Service Order')
    }
}

const update = async (req, res) => {
    const { id, deliveryDate, entryDate, deliveryPeriod, totalPrice, status, customerId, dressmakerId } = req.body
    const idRequest = req.params.id

    console.log(idRequest, id)

    if (parseInt(idRequest) !== id)
        return Exception(res, 400, 'Path ID and payload ID does not matches')

    const service = { id, deliveryDate, entryDate, deliveryPeriod, totalPrice, status, customerId, dressmakerId }

    if (!await models.ServiceOrder.findOne({ where: { id: id } }))
        return Exception(res, 404, 'Service Order not found')

    const error = validateServiceOrder(res, service)
    if (error)
        return error

    try {
        await models.ServiceOrder.update(service, { where: { id: id } })
        return res.status(200).json(service)
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to update Service Order')
    }
}

const destroy = async (req, res) => {
    const idRequest = parseInt(req.params.id)

    let serviceOrderFound = await models.ServiceOrder.findOne({
        include: [{
            model: models.Service,
            as: 'services'
        }],
        where: { id: idRequest }
    })
    if (!serviceOrderFound)
        return Exception(res, 404, 'Service Order not found')


    try {
        serviceOrderFound = await serviceOrder(serviceOrderFound.dataValues)
        await models.ServiceOrder.destroy({ where: { id: idRequest } })

        if (serviceOrderFound.services) {
            console.log(serviceOrderFound.services)
            for (const service of serviceOrderFound.services) {
                await models.Service.destroy({ where: { id: service.dataValues.id } })
            }
        }
        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return Exception(res, 500, 'Error to remove Service Order')
    }
}

export default {
    index,
    findById,
    findByCustomerId,
    findByDressMakerId,
    findByCustomerAndDressmakerId,
    findByIdAndCustomerId,
    findByIdAndDressmakerId,
    findByIdAndCustomerAndDressmakerId,
    store,
    update,
    destroy
}