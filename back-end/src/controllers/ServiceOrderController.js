import models, { sequelize } from '../models';
import { Exception } from '../exceptions/responseException'

import { findCustomerById } from '../services/CustomerService'
import { findDressmakerById } from '../services/DressmakerService'


const { Op } = require("sequelize");

const validateDate = (date, dataCompare) => {
    console.log(date, dataCompare)

    if (date.getDate() < dataCompare.getDate())
        return false
    return true
}

const validateStatus = (status) => {
    if (!(status.toUpperCase() === 'FINISHED') && !(status.toUpperCase() === 'PENDING'))
        return false
    return true
}

const validateServices = (res, services) => {
    if (!services || services.length === 0)
        return Exception(res, 400, 'Services are required')

    for (const service of services) {
        if (!service.name || !service.price)
            return Exception(res, 400, 'Check if all services contains name and price')
    }
    return null
}

const validateServiceOrder = async (res, service) => {
    if (!service.entryDate || service.entryDate === '')
        return Exception(res, 400, 'Entry date is required')

    if (!validateDate(new Date(service.entryDate), new Date()) ||
        !validateDate(new Date(service.deliveryDate), new Date(service.entryDate))) {
        return Exception(res, 400, 'Entry date is invalid')
    }

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

    if (service.id) {
        if (!service.statusService || service.statusService === '')
            return Exception(res, 400, 'Status service is required')
        if (!validateStatus(service.statusService))
            return Exception(res, 400, 'Status service must be \'FINISHED\' or \'PENDING\'')
        if (!service.statusPayment || service.statusPayment === '')
            return Exception(res, 400, 'Status payment is required')
    }

    if (!service.customerId || service.customerId === '')
        return Exception(res, 400, 'Customer ID is required')
    if (await findCustomerById(service.customerId) === null)
        return Exception(res, 400, 'Customer not found')

    if (!service.dressmakerId || service.dressmakerId === '')
        return Exception(res, 400, 'Dressmaker ID is required')
    if (await findDressmakerById(service.dressmakerId) === null)
        return Exception(res, 400, 'Dressmaker not found')

    return null
}

const getSelector = (orderByPrice, limit, offset, status, dateField, startDate, endDate) => {
    let selector = {
        order: orderByPrice ? [['totalPrice', orderByPrice.toUpperCase()]] : [],
        include: ['services'],
        limit: limit,
        offset: offset,
    }

    const validDateFilter = (startDate && endDate && dateField)

    if (status || validDateFilter)
        selector['where'] = { [Op.and]: [] }

    if (status) {
        if (validateStatus(status)) {
            selector.where[Op.and].push({ status: status })
        } else {
            return Exception(res, 400, 'Wrong status!')
        }
    }

    if (validDateFilter && new Date(startDate).getTime() < new Date(endDate).getTime()) {
        selector.where[Op.and].push({
            [dateField]: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        })
    } else if (validDateFilter && new Date(startDate).getTime() === new Date(endDate).getTime()) {
        selector.where[Op.and].push({
            [dateField]: new Date(startDate)
        })
    }

    return selector
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

        const status = req.query.status

        const dateField = req.query.dateField
        const startDate = req.query.startDate
        const endDate = req.query.endDate

        const selector = getSelector(orderByPrice, limit, offset, status, dateField, startDate, endDate)
        console.log(selector)

        let serviceOrders = await models.ServiceOrder.findAndCountAll(selector)

        for (const element of serviceOrders.rows)
            await serviceOrder(element.dataValues)

        return res.json(serviceOrders)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByCustomerId = async (req, res) => {
    const customerId = req.params.id

    try {
        const orderByPrice = req.query.orderByPrice

        const limit = req.query.limit
        const offset = req.query.offset

        const status = req.query.status

        const dateField = req.query.dateField
        const startDate = req.query.startDate
        const endDate = req.query.endDate

        let selector = getSelector(orderByPrice, limit, offset, status, dateField, startDate, endDate)
        selector.where[Op.and].push({
            ['customerId']: customerId
        })
        console.log(selector)

        let serviceOrders = await models.ServiceOrder.findAndCountAll(selector)

        for (const element of serviceOrders.rows)
            await serviceOrder(element.dataValues)

        return res.json(serviceOrders)
    } catch (error) {
        return Exception(res, 500, 'Error to retrieve Service Order')
    }
}

const findByDressMakerId = async (req, res) => {
    const dressmakerId = req.params.id

    try {
        const orderByPrice = req.query.orderByPrice

        const limit = req.query.limit
        const offset = req.query.offset

        const status = req.query.status

        const dateField = req.query.dateField
        const startDate = req.query.startDate
        const endDate = req.query.endDate

        let selector = getSelector(orderByPrice, limit, offset, status, dateField, startDate, endDate)
        selector.where[Op.and].push({
            ['dressmakerId']: dressmakerId
        })
        console.log(selector)

        let serviceOrders = await models.ServiceOrder.findAndCountAll(selector)

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

    try {
        const orderByPrice = req.query.orderByPrice

        const limit = req.query.limit
        const offset = req.query.offset

        const status = req.query.status

        const dateField = req.query.dateField
        const startDate = req.query.startDate
        const endDate = req.query.endDate

        let selector = getSelector(orderByPrice, limit, offset, status, dateField, startDate, endDate)
        selector.where[Op.and].push({
            ['customerId']: customerId
        })
        selector.where[Op.and].push({
            ['dressmakerId']: dressmakerId
        })
        console.log(selector)

        let serviceOrders = await models.ServiceOrder.findAndCountAll(selector)

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

const getTotalPrice = (services) => {
    const totalPrice = services.map(elem => elem.price).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    })
    return totalPrice
}

const deleteOldServices = async (idServiceOrder, services) => {
    const servicesDB = await models.Service.findAll({ where: { serviceOrderId: idServiceOrder } })

    const servicesIdDB = servicesDB.map(serv => serv.id)
    const servicesId = services.filter(elem => elem.id).map(serv => serv.id)
    const servicesIdFiltered = servicesIdDB.filter(id => !servicesId.includes(id));

    if (servicesIdFiltered.length !== 0) {
        servicesIdFiltered.forEach(async id => {
            await models.Service.destroy({ where: { id: id } })
        });
    }

}

const storeServices = async (serviceOrderId, services) => {
    for (const serv of services) {
        serv.serviceOrderId = serviceOrderId
        if (!serv.id)
            await models.Service.create(serv)
        else {
            if (await models.Service.findOne({ where: { id: serv.id } }))
                await models.Service.update(serv, { where: { id: serv.id } })
        }
    }
}

const store = async (req, res) => {
    const { entryDate, deliveryDate, deliveryPeriod, services, customerId, dressmakerId } = req.body
    const serviceOrder = {
        deliveryDate, entryDate, deliveryPeriod,
        statusService: 'PENDING', statusPayment: false,
        customerId, dressmakerId
    }
    let error = await validateServices(res, services)
    if (error)
        return error
    error = await validateServiceOrder(res, serviceOrder)
    if (error)
        return error

    serviceOrder['totalPrice'] = getTotalPrice(services)

    try {
        const result = await models.ServiceOrder.create(serviceOrder);
        await storeServices(result.id, services)
        return res.status(201).json(result)
    } catch (error) {
        return Exception(res, 500, 'Error to create new Service Order')
    }
}

const update = async (req, res) => {
    const {
        id, entryDate, deliveryDate, deliveryPeriod, totalPrice, statusService,
        statusPayment, services, customerId, dressmakerId
    } = req.body
    const idRequest = req.params.id

    console.log(idRequest, id)

    if (parseInt(idRequest) !== id)
        return Exception(res, 400, 'Path ID and payload ID does not matches')

    if (!await models.ServiceOrder.findOne({ where: { id: id } }))
        return Exception(res, 404, 'Service Order not found')

    const serviceOrder = {
        id, entryDate, deliveryDate, deliveryPeriod, totalPrice,
        statusService, statusPayment, customerId, dressmakerId
    }

    let error = await validateServices(res, services)
    if (error)
        return error

    error = await validateServiceOrder(res, serviceOrder)
    if (error)
        return error

    await deleteOldServices(id, services)
    await storeServices(id, services)
    const servicesDB = await models.Service.findAll({ where: { serviceOrderId: id } })
    serviceOrder['totalPrice'] = getTotalPrice(servicesDB)

    try {
        await models.ServiceOrder.update(serviceOrder, { where: { id: id } })
        return res.status(200).json(serviceOrder)
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