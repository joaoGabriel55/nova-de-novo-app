export class ServiceOrderModel {
    id
    entryDate = new Date()
    deliveryDate = new Date()
    deliveryPeriod
    totalPrice = 0.0
    statusService = 'PENDING'
    statusPayment = false
    services
    customerId
    dressmakerId
}

export class ServiceModel {
    name
    price
    serviceOrderId
}

export function serviceOrderModelParser(object) {

    const serviceOrder = new ServiceOrderModel()
    serviceOrder.id = object.id
    serviceOrder.entryDate = object.entryDate
    serviceOrder.deliveryDate = object.deliveryDate
    serviceOrder.deliveryPeriod = object.deliveryPeriod
    serviceOrder.totalPrice = object.totalPrice
    serviceOrder.statusService = object.statusService
    serviceOrder.statusPayment = object.statusPayment
    serviceOrder.services = object.services
    serviceOrder.customerId = object.customer.id
    serviceOrder.dressmakerId = object.dressmaker.id

    return serviceOrder
}