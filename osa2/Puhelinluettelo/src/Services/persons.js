import axios from 'axios'
const baseURL = '/api/persons';
//For local           const baseURL = 'http://localhost:3001/api/persons';
// for distribution    const baseURL = '/api/persons';

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