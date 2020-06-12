import { API } from './Api'

export const getDressmakers = (limit, offset) => API.get('/dressmakers', { params: { limit, offset, orderBy: 'ASC' } })
