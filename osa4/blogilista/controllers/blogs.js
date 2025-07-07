const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogsRouter = express.Router()


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})


blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes} = req.body

 const decodedToken = jwt.verify(req.token, process.env.SECRET)



  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

 const user = await User.findById(decodedToken.id)

    if (!title || !url) {
    return res.status(400).json({ error: 'add title and url' })
  }
  
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
    const blog = new Blog({
    title, author, url,
    likes: likes || 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await Blog.findByIdAndDelete(id)

    if (!result) {
      return res.status(404).json({ error: 'blog not found' })
    }
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = {
    title, author, url, likes
  }
  try {
    const result = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
      new: true, runValidators: true
    })

    if (!result) {
      return res.status(404).json({ error: 'blog not found' })
    }
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: 'malformatted id' })
  }
})


module.exports = blogsRouter
