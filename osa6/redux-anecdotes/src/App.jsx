import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import anecdotes from './services/anecdotes'
import { setAnecdote } from './reducers/anecdoteSlice'
import { useDispatch } from 'react-redux'

const App = () => {
   const dispatch = useDispatch()
  useEffect(() => {
    anecdotes
      .getAll().then(anecdotes => dispatch(setAnecdote(anecdotes)))
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>
       <Notification />
       <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App