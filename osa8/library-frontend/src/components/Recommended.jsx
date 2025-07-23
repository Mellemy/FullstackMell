import { useQuery } from '@apollo/client'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommended = ({ show }) => {
  const userResult = useQuery(ME)

  const favoriteGenre = userResult.data?.me?.favoriteGenre

  const booksResult = useQuery(BOOKS_BY_GENRE, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre },
  })

  if (!show) return null

  if (userResult.loading) return <div>Loading user data...</div>
  if (userResult.error) return <div>Error loading user info</div>
  if (booksResult.loading) return <div>Loading books...</div>
  if (booksResult.error) return <div>Error loading books</div>

  const books = booksResult.data?.allBooks ?? []

  return (
    <div>
      <h2>recommended</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
      {books.length === 0 ? (
        <p>No books exist for this genre</p>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Recommended
