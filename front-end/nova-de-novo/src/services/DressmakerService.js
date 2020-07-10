import { API } from './Api'

export const getDressmakers = (limit, offset) =>
    API.get('/dressmakers', { params: { limit, offset, orderBy: 'ASC' } })

export const getDressmakersLike = (limit, offset, name) =>
    API.get('/dressmakers', { params: { limit, offset, orderBy: 'ASC', like: name } })

export const getDressmakerById = (id) => API.get(`/dressmakers/${id}`)

export const createDressmaker = (dressmaker) => API.post(`/dressmakers`, dressmaker)

export const updateDressmaker = (id, dressmaker) => API.patch(`/dressmakers/${id}`, dressmaker)

export const deleteDressmaker = (id) => API.delete(`/dressmakers/${id}`)