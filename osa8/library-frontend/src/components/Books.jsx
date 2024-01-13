import { GET_ALL_BOOKS } from "../query"
import { useQuery } from "@apollo/client"

const Books = (props) => {
  const books = useQuery(GET_ALL_BOOKS)
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

  return (
    <div>
      <h2>books</h2>

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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
