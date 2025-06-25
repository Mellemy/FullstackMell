
import axios from 'axios'
const baseUrl = '/api/notes'


const getAll = () => {
  return axios.get(baseURL)
}

const create = newObject => {
  return axios.post(baseURL, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseURL}/${id}`, newObject)
}

const erase = (id) => axios.delete(`${baseURL}/${id}`)

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  erase: erase
}