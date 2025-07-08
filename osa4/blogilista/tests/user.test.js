const assert = require('node:assert')
const { test, beforeEach, after, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/list_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const getUsers = async () => {
  const response = await api.get('/api/users')
  return response.body
}

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Admin', passwordHash })
  await user.save()
})

describe('User', () => {
  test('succeeds in creating a user with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

 test('fails with 400 if username taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'johnny',
    name: 'John',
    password: 'salainen',
  }

  await api.post('/api/users').send(newUser).expect(201)

  const duplicateUser = {
    username: 'johnny',
    name: 'Duplicate John',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('expected `username` to be unique'))

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
})

  test('fails with 400 if no password', async () => {
    const newUser = {
      username: 'newuser',
      name: 'No Password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('password must be'))
  })

  test('fails with 400 if password is too short', async () => {
    const newUser = {
      username: 'Smalljohn',
      name: 'littleJohn',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('password must be'))
  })
  after(async () => {
    await mongoose.connection.close()
  })
  
})


