require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
//change Person to person before gitpush

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))



app.get('/', (req, res) => {
  res.send('Backend is running!')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      const html = `
        <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${date}</p>
        </div> `
      response.send(html)  }) .catch(error => next(error)) })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'No person with that ID was found' })
      }}) .catch(error => next(error))})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    if (result === null) {
      response.status(404).json({ error: 'Person not found' })
    } else {
      response.status(204).end()
    }

  })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Please add Name and Number' })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'Name must be unique' })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

      return person.save()
        .then(savedPerson => response.status(201).json(savedPerson))
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const updatedPerson = {
    name,
    number
  }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updated => {
      if (updated) {
        response.json(updated)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return response.status(500).json({ error: 'Something went wrong on the server' })
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})