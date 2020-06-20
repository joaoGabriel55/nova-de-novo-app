export class ServiceOrderModel {
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