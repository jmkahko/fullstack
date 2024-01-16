import { MY_FAVORITE_GENRE_BOOKS, GET_ME } from "../query"
import { useQuery } from "@apollo/client"

const Recommend = (props) => {
  const me = useQuery(GET_ME)
  const books = useQuery(MY_FAVORITE_GENRE_BOOKS)

  if (!props.show) {
    return null
  }

  if (me.loading) {
    return (
      <div>
        <p>Loading recommendations</p>
      </div>
    )
  }

  return(
    <div>
      <h1>recommendations</h1>
      <p>books in your favorite genre <b>{ me.data.me.favoriteGenre }</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.myFavoriteGenreBooks.map((a) => (
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

export default Recommend