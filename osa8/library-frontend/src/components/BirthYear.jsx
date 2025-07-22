import { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born

    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
    }
  }
`
const BirthYear = (props) => {
    if (!props.show) {
    return null
  }
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const { data, loading } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message)
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    await editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    })
    setName('')
    setBorn('')
  }

  if (loading) return <div>Loading...</div>

  const authors = data.allAuthors

  return (
    <div>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="" disabled>Select</option>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthYear