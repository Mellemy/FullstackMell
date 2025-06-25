const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
//uuh2
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))



let persons = [
 {
      "id": "1",
      "name": "John Testman",
      "number": "81234"
    
    },
    {
    "id": "2",
      "name": "Ada Lovelace",
      "number": "253242342"
      
    },
    {
    "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
        "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    },
    {
      "id": "5",
      "name": "Mell",
      "number": "243"
    },
    {
      "id": "6",
      "name": "Mary2",
      "number": "24321431"
    }]

  app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
 const count = persons.length
  const date = new Date()
  const html = `
    <div>
      <p>Phonebook has ${count} people</p>
      <p>${date}</p>
    </div>
  `
  response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'No person with that ID was found' })
}})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const initialLength = persons.length
  persons = persons.filter(p => p.id !== id)
 
  if (persons.length === initialLength) {
    return response.status(404).json({ error: 'Person not found' })
  }
   response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Please add Name and Number' })
  }
 const duplicate = persons.find(p => p.name === body.name)
  if (duplicate) {
    return response.status(400).json({ error: 'Name must be unique' })
  }
  const newPerson = {
    id: Math.floor(Math.random() * 100000).toString(),
    name: body.name,
    number: body.number
  }
  persons.push(newPerson)
  response.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})