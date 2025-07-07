const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response, next) => {
  try {
   const users = await User.find({}).populate('blogs', {
  title: 1,
  author: 1,
  url: 1
})

response.json(users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    blogs: u.blogs
    })))
  } catch (error) {
    next(error)
  }
})

// POST create user
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!password || password.length < 3) {
      return response
        .status(400)
        .json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter