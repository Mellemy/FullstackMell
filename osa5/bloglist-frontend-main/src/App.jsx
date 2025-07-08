import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import BlogForm from './components/Blogform'
import Togglable from './components/togglable'
import { useRef } from 'react'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogVisible, setblogVisible] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async  (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const Logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateBlog = async (newBlog) => {
    if (!newBlog) {
      setErrorMessage('please fill all fields')
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`a new blog "${createdBlog.title}" was added by ${user.name}`)
      setTimeout(() => setSuccessMessage(null), 5000)

      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error('Failed to create blog', error)
      setErrorMessage('something went wrong while creating the blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blogToLike) => {
    try {
      const updatedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
        user: blogToLike.user.id,
      }
      const returnedBlog = await blogService.update(blogToLike.id, updatedBlog)

      returnedBlog.user = blogToLike.user
      setBlogs(blogs.map(blog =>
        blog.id === blogToLike.id ? returnedBlog : blog
      ))
    } catch (error) {
      console.error('Failed to update blog likes', error)
      setErrorMessage('Failed to like blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleDelete = async (deleted) => {
    const confirm = window.confirm(`Delete "${deleted.title}" by ${deleted.author}?`)
    if (!confirm) return

    try {
      await blogService.remove(deleted.id)
      setBlogs(blogs.filter(blog => blog.id !== deleted.id))
      setSuccessMessage(`Deleted blog: ${deleted.title}`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      console.error('Failed to delete blog', error)
      setErrorMessage('Failed to delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  if (user === null) {
    return (
      <div>

        <h2>Log in to application</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>

      </div>
    )
  }
  return (
    <div>

      <h2>Blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <p>{user.name} logged in
        <button onClick={Logout} >Logout</button>
      </p>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            currentUser={user}
          />
        )}

      <Togglable buttonLabel="add blog" ref={blogFormRef}>
        <h2>Create a new blog</h2>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
    </div>
  )


}

export default App