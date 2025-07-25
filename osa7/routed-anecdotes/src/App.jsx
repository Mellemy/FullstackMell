import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams, useNavigate
} from 'react-router-dom'
import  { useField } from './hooks/index.js'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div> 
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </div>
  )
}
const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div style={{ border: 'solid', padding: '10px', borderWidth: 1,  marginBottom: 5 }}>
      {message}
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>)}
    </ul>
  </div>
)


const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const SoloAnecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has <strong>{anecdote.votes}</strong> votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}


const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
 const navigate = useNavigate()

 const handleSubmit = (e) => {
    e.preventDefault()
    const newAnecdote = {
      content: content.inputProps.value,
      author: author.inputProps.value,
      info: info.inputProps.value,
      votes: 0
    }
    addNew(newAnecdote)
    setNotification(`posted new anecdote: "${content.inputProps.value}"`)
    setTimeout(() => setNotification(''), 5000)
    navigate('/')
}

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.inputProps} name="content" />
        </div>
        <div>
          author
           <input {...author.inputProps} name="author" />
        </div>
        <div>
          url for more info
       <input {...info.inputProps} name="info" />
        </div>
         <button type="submit">create</button>
         <button type="button" onClick={() => {
            content.reset()
            author.reset()
            info.reset()
            }}>
            reset
        </button>
      </form>
    </div>
  )

}

const App = () => {
  const anecdote = useField('anecdote')

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
 const [notification, setNotification] = useState('')
 
  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }


  return (
     <Router>
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
        <Notification message={notification} />
      <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path="/about" element={<About />} />
          <Route path="/anecdotes/:id" element={<SoloAnecdote anecdotes={anecdotes} />} />
        </Routes>
      <Footer />
    </div>
    </Router>
  )
}

export default App
