require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()
const tokenExtractor = require('./utils/tokenExtractor')

mongoose.connect(config.MONGODB_URI)
app.use(express.json()) //this before routes REMBER V thats a router
app.use(tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' }) }

  next(error)
}

app.use(errorHandler)
module.exports = app
