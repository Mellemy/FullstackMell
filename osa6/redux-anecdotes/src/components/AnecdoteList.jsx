import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const lowercasedFilter = filter.toLowerCase()
    return anecdotes
      .filter(a => a.content.toLowerCase().includes(lowercasedFilter))
      .sort((a, b) => b.votes - a.votes)
  })
  const dispatch = useDispatch()

  

    const handleVote = (anecdote) => {
   dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted for "${anecdote.content}"`, 5))
  }

  return (
    <div>
    {anecdotes.map(anecdote =>
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
