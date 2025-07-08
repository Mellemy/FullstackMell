const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/userExtractor')

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})


blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  const user = req.user

  if (!title || !url) {
    return res.status(400).json({ error: 'add title and url' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const { id } = req.params
  const user = req.user

  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'only owner can delete' })
    }

    await Blog.findByIdAndDelete(id)
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