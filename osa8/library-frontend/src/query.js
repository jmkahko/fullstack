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