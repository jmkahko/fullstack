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
      author {
        name
      }
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
        author {
          name
        }
        genres
    }
  }
`

export const UPDATE_AUTHOR_BORN = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo) {
        born
        name
        bookCount
    }
  }
`

export const USER_LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password) {
        value
    }
  }
`

export const GET_ALL_GENRE = gql`
  query allGenres {
    allGenres
  }
`

export const GET_ALL_BOOKS_GENRE = gql`
  query allBooks($genre: String) {
    allBooks(
      genre: $genre
    ) {
      author {
        name
      }
      published
      title
    }
  }
`

export const GET_ME = gql`
  query Me {
    me {
      username,
      favoriteGenre
    }
  }
`

export const MY_FAVORITE_GENRE_BOOKS = gql`
  query myFavoriteGenreBooks {
    myFavoriteGenreBooks {
      author {
        name
      }
      published
      title
    }
  }
`