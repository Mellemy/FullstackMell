import axios from 'axios'
const baseURL = 
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/persons'
    : '/api/persons';


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