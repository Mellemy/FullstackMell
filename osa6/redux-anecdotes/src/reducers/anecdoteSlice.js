
import { createSlice } from '@reduxjs/toolkit'
import anecdotes from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
   initialState: [],
  reducers: {
    vote(state, action) {
     const updatedAnecdote = action.payload
       return state.map(anec =>
    anec.id === updatedAnecdote.id ? updatedAnecdote : anec
      )
    },
 

      appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  }
})

export const { vote, appendAnecdote, setAnecdote } = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes2 = await anecdotes.getAll()
    dispatch(setAnecdote(anecdotes2))
  }
}
export const makeAnec = content => {
  return async dispatch => {
    const newAnecdote = await anecdotes.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updated = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const saved = await anecdotes.update(updated)
    dispatch(vote(saved))
  }
}
export default anecdoteSlice.reducer
