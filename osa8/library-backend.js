const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const { GraphQLError } = require('graphql')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to : ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB : ', error.message)
  })



let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Query {
    dummy: Int
    bookCount: Int!
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const books = await Book.find({})
        return books
      }

      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })

        const genreAuthorBook = await Book.find({
          genres: args.genre,
          author: author._id
        })

        return genreAuthorBook
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        const authorBook = await Book.find({
          author: author._id
        })

        return authorBook
      }

      if (args.genre) {
        const genreBook = await Book.find({
          genres: args.genre
        })

        return genreBook
      }
    },
    allAuthors: async (root, args) => {
      return Author.find({})
    }
  },
  Author: {
    bookCount: async (root, args) => {
      const booksCount = await Book.find({
        author: root._id
      }).count()

      return booksCount
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })

      if (author === null) {
        const newAuthor = new Author({
          name: args.author
        })

        try {
          const saveAuthor = await newAuthor.save({
            name: args.author
          })
  
          const newBook = new Book({
            title: args.title,
            published: args.published,
            author: saveAuthor,
            genres: args.genres
          })
    
          await newBook.save()
    
          return newBook
        } catch (error) {
          throw new GraphQLError(error, {
            extensions: {
              code: 'BAD_INPUT',
              error
            }
          })
        }
      } else {
        try {        
          const newBook = new Book({
            title: args.title,
            published: args.published,
            author: author,
            genres: args.genres
          })

          await newBook.save()
          return newBook
        } catch (error) {
          throw new GraphQLError(error, {
            extensions: {
              code: 'BAD_INPUT',
              error
            }
          })
        }
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (author === null) {
        return null
      }

      await Author.updateOne(
        { name: author.name }, 
        { $set: { born: args.setBornTo } 
      })

      const authorUpdated = await Author.findOne({ name: args.name })

      return authorUpdated
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})