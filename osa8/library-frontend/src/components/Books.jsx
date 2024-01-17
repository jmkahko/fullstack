import { GET_ALL_BOOKS_GENRE, GET_ALL_GENRE } from "../query"
import { useQuery } from "@apollo/client"
import Select from 'react-select';
import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setGenreSelected] = useState('')
  const [queryGenre, setQueryGenre] = useState('')

  let books = useQuery(GET_ALL_BOOKS_GENRE, {
    variables: { genre: queryGenre },
    refetchQueries: [ 
      { query: GET_ALL_BOOKS_GENRE }
    ],
    fetchPolicy: "no-cache"
  })

  const genres = useQuery(GET_ALL_GENRE)
  if (!props.show) {
    return null
  }

  if (books.loading) {
    return (
      <div>
        <p>Loading books</p>
      </div>
    )
  }

  let genreOptions = []
  genreOptions.push({ value: '', label: '' })
  genres.data.allGenres.map((g) => {
    genreOptions.push({ value: g, label: g })
  })

  const handleSelectedChange = (selected) => {
    setGenreSelected(selected)
    setQueryGenre(selected.value)
  }

  return (
    <div>
      <h2>books</h2>

      <div>
          <Select value={selectedGenre} onChange={handleSelectedChange} options={genreOptions} placeholder="Select genre..." />
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
