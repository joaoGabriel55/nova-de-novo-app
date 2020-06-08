import { API } from './Api'

export const getCustomers = (limit, offset) => API.get('/customers', { params: { limit, offset } })