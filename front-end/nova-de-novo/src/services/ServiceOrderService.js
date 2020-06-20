import { API } from './Api'

export const createServiceOrder = (serviceOrder) => API.post(`/service-orders`, serviceOrder)

export const createService = (service) => API.post(`/services`, service)
