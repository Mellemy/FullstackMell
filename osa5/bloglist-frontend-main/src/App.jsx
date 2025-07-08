import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'


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

  const CreateBlog = async (event) => {
  event.preventDefault()
  if (!newTitle || !newAuthor || !newUrl) {
    setErrorMessage('please fill all fields')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    return
  }
  try {
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    const createdBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(createdBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setSuccessMessage(`a new blog "${createdBlog.title}" was added by ${user.name}`)
    setTimeout(() => {
    setSuccessMessage(null)
    } , 5000)
  } catch (error) {
    console.error('Failed to create blog', error)
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
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

    <h2>Create a new blog</h2>
    <form onSubmit={CreateBlog}>
    <div>
    Title:
    <input type="text"  value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
  </div>
  <div>
    Author:
    <input type="text"  value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)}  />
  </div>
  <div>
    URL:
    <input type="text" value={newUrl}
      onChange={({ target }) => setNewUrl(target.value)}
    />
  </div>
  <button type="submit">Create</button>
</form>
    </div>
    
  )
  

}

export default App