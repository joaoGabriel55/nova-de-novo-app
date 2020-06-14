import { API } from '../Api'

export const userLogin = (userCrendentials) => API.post('/auth/login', userCrendentials)