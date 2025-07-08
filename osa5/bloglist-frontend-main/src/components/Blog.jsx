import { useState } from 'react'
import '../index.css'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }
const owned = blog.user?.username === currentUser?.username

  return (
    <div className="blog">
    <div>
       {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
        <div> {blog.url}</div>
        <div>
         Likes: {blog.likes}{' '}
        <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div> {blog.user?.name}</div>
          {owned && (
          <button className="remove" onClick={() => handleDelete(blog)}>
          Remove
          </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
