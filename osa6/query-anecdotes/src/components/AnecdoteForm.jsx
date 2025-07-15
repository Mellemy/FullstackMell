import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import  { useNotification } from "./Notification"

const AnecdoteForm = () => {
const queryClient = useQueryClient()
const [, dispatch] = useNotification()

 const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET', payload: `Posted new Anecdote: "${newAnecdote.content}"` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
    onError: (error) => {
      dispatch({
        type: 'SET',
        payload: error.response?.data?.error || 'Anecdote is too damn short'
      })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }

  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
  newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
