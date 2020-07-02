import { API } from './Api'

export const getServiceOrderById = (id) => API.get(`/service-orders/${id}`)

export const createServiceOrder = (serviceOrder) => API.post(`/service-orders`, serviceOrder)

export const updateServiceOrder = (id, serviceOrder) => API.patch(`/service-orders/${id}`, serviceOrder)

export const createService = (service) => API.post(`/services`, service)
