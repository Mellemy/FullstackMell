import { useState } from 'react'
import '../index.css'

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

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
        </div>
      )}
    </div>
  )
}

export default Blog
