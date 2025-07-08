 
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
  event.preventDefault()
    if (!newTitle || !newAuthor || !newUrl) {
      createBlog(null) 
      return
    }

    createBlog({
      title: newTitle, author: newAuthor, url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title:
        <input
          type="text"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)} />
      </div>
       <div>
        Author:
        <input
        type="text"  value={newAuthor}
        onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        URL:
        <input
          type="text"  value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm
