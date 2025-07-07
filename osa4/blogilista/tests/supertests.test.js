const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const BlogTables = [
  {
      title: 'Big blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Small blogger party',
      author: 'John Testman',
      likes: 7
    },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of BlogTables) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('Return correct amount of Json', async () => {
 const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
     require('node:assert').strictEqual(response.body.length, BlogTables.length)
})

test('blogs have ID', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  require('node:assert').strictEqual(blog.id !== undefined, true)
})

test('POST increase by 1', async () => {
  const PostedBlog = {
    title: 'Marys new blog',
    author: 'Mary',
    url: 'http://IDK.com/testing',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(PostedBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  require('node:assert').strictEqual(response.body.length, BlogTables.length + 1)
  const titles = response.body.map(blog => blog.title)
  require('node:assert').strictEqual(titles.includes('Marys new blog'), true)
})

test('0 for no likes', async () => {
const PostedBlog2 = {
    title: 'Marys new blog',
    author: 'Mary',
    url: 'http://IDK.com/testing'
  }
  const response = await api
    .post('/api/blogs')
    .send(PostedBlog2)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  require('node:assert').strictEqual(response.body.likes, 0)
})


test('no title returns 400', async () => {
 const PostedBlog3 = {
    author: 'Mary',
    url: 'http://IDK.com/testing',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(PostedBlog3)
    .expect(400)
})

test('no url returns 400', async () => {
 const PostedBlog4 = {
    title: 'Marys new blog',
    author: 'Mary',
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(PostedBlog4)
    .expect(400)
})

test('blog deletion', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const Deleted = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${Deleted.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  const ids = blogsAtEnd.body.map(b => b.id)

  require('node:assert').strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length - 1
  )

  require('node:assert').strictEqual(ids.includes(Deleted.id), false)
})


test('blog update', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const Updated = blogsAtStart.body[0]

const NewLikes = { likes: 12 }

 const response = await api
    .put(`/api/blogs/${Updated.id}`)
    .send(NewLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  require('node:assert').strictEqual(response.body.likes, 12)
})


after(async () => {
  await mongoose.connection.close()
})


