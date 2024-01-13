import { useState } from 'react'
import { GET_ALL_AUTHORS, UPDATE_AUTHOR_BORN } from "../query"
import { useQuery, useMutation } from "@apollo/client"

const Authors = (props) => {
  const [born, setBorn] = useState('')
  const [author, setAuthor] = useState('')
  const authors = useQuery(GET_ALL_AUTHORS)
  const [ updateAuthorBorn ] = useMutation(UPDATE_AUTHOR_BORN, {
    refetchQueries: [ 
      { query: GET_ALL_AUTHORS }
    ]
  })

  if (!props.show) {
    return null
  }

  if (authors.loading) {
    return (
      <div>
        <p>Loading authors</p>
      </div>
    )
  }

  const submit = async (event) => {
    event.preventDefault()

    updateAuthorBorn({
      variables: { name: author, setBornTo: parseInt(born) }
    })

    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
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

export default Authors
