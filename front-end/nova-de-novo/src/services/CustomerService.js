import { API } from './Api'

export const getCustomers = (limit, offset) => API.get('/customers', { params: { limit, offset, orderBy: 'ASC' } })

export const getCustomersLike = (limit, offset, name) => API.get('/customers', { params: { limit, offset, orderBy: 'ASC', like: name } })

export const getCustomerById = (id) => API.get(`/customers/${id}`)

export const createCustomer = (customer) => API.post('/customers', customer)

export const updateCustomer = (id, customer) => API.patch(`/customers/${id}`, customer)