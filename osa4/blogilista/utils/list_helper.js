const _ = require('lodash')
const User = require('../models/user')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
   if (blogs.length === 0) return null

  return blogs.reduce((fav, blog) => {
  return blog.likes > fav.likes ? blog : fav
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const topBlogger = _.maxBy(Object.keys(grouped), author => grouped[author].length)

  return {
    author: topBlogger,
    blogs: grouped[topBlogger].length
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const topBlogger2 = _(blogs)
    .groupBy('author')
    .map((posts, author) => ({
      author,
      likes: _.sumBy(posts, 'likes')
    }))
    .maxBy('likes')

  return topBlogger2
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, usersInDb
}



