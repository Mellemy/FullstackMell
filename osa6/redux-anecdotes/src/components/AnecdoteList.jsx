import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'
import { useMemo } from 'react'

const AnecdoteList = () => {
 const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const filtered = useMemo(() => {
    const lowercasedFilter = filter.toLowerCase()
    return anecdotes
      .filter(a => a.content.toLowerCase().includes(lowercasedFilter))
      .sort((a, b) => b.votes - a.votes)
  }, [anecdotes, filter])

  

    const handleVote = (anecdote) => {
   dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted for "${anecdote.content}"`, 5))
  }

  return (
    <div>
  {filtered.map(anecdote =>
        <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
            has {anecdote.votes}
             <button onClick={() => handleVote(anecdote)}>vote</button>
         </div>
        </div>
        )}
    </div>
  )
}

export default AnecdoteList
