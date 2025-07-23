import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)

 const { loading, data } = useQuery(ALL_BOOKS, {
  variables: { genre: genreFilter },
  fetchPolicy: 'network-only',
})

  if (!props.show) return null
  if (loading) return <div>loading...</div>

  const books = data.allBooks

  const genreSet = new Set()
  data.allBooks.forEach(book => {
    book.genres.forEach(genre => genreSet.add(genre))
  })
  const genres = Array.from(genreSet)

  return (
    <div>
      <h2>books</h2>

      <div>
      
      </div>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title + book.published}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setGenreFilter(null)}>all genres</button>
        {genres.map(genre => (
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
