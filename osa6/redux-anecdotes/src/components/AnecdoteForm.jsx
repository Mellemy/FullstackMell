import { useDispatch } from 'react-redux'
import { makeAnec } from '../reducers/anecdoteSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(makeAnec(content))
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
