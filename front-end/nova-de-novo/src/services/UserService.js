import { API } from './Api'

export const getUserByUsername = (username) => API.get(`/users/${username}`)
