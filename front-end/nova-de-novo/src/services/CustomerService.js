import { API } from './Api'

export const getCustomers = (limit, offset) => API.get('/customers', { params: { limit, offset } })

export const getCustomerById = (id) => API.get(`/customers/${id}`)

export const createCustomer = (customer) => API.post('/customers', customer)

export const updateCustomer = (id, customer) => API.patch(`/customers/${id}`, customer)