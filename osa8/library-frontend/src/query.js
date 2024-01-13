import { gql } from "@apollo/client"

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      born
      name
      bookCount
    }
  }
`

export const GET_ALL_BOOKS = gql`
  query ExampleQuery {
    allBooks {
      author
      published
      title
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String]!) {
    addBook(
      title: $title, 
      published: $published, 
      author: $author, 
      genres: $genres) {
        title,
        published,
        author,
        genres
    }
  }
`