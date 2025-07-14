import { useDispatch } from 'react-redux'
import { makeAnec } from '../reducers/anecdoteSlice'
import { showNotification } from '../reducers/notificationSlice'
import anecdotes from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdotes.createNew(content)
    dispatch(makeAnec(newAnecdote))
    dispatch(showNotification(`Posted new Anecdote: '${content}'`, 5))
  }

  return (
    <div> <h2>create new</h2>
    <form onSubmit={handleSubmit}>
      <div><input name="anecdote" /></div>
      <button type="submit">create</button>
    </form>
    </div>
  )
}

export default AnecdoteForm
