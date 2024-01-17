const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const books = await Book.find({}).populate('author')
        return books
      }

      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })

        const genreAuthorBook = await Book.find({
          genres: args.genre,
          author: author._id
        }).populate('author')

        return genreAuthorBook
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        const authorBook = await Book.find({
          author: author._id
        }).populate('author')

        return authorBook
      }

      if (args.genre) {
        const genreBook = await Book.find({
          genres: args.genre
        }).populate('author')

        return genreBook
      }
    },
    allAuthors: async (root, args) => {
      return Author.find({})
    },
    me: async (root, args, context) => {
      return context.validUser
    },
    allGenres: async (root, args) => {
      let allGenres = []

      const booksGenres = await Book.find({}, { genres: 1, _id: 0 })
      booksGenres.map((book) => {
        book.genres.map((genre) => {
          allGenres.push(genre)
        })
      })

      const removeDuplicate = [...new Set(allGenres)]

      return removeDuplicate
    },
    myFavoriteGenreBooks: async (root, args, context) => {
      const me = context.validUser
      const books = await Book.find({ genres: me.favoriteGenre }).populate('author')
      return books
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
    addBook: async (root, args, context) => {
      const validUser = context.validUser

      if (validUser === undefined) {
        throw new GraphQLError('book add failed', {
          extensions: {
            code: 'AUTHENTICATION_FAILED'
          }
        })
      }

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
          pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
    
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
          pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
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
    editAuthor: async (root, args, context) => {
      const validUser = context.validUser

      if (validUser === undefined) {
        throw new GraphQLError('edit author failed', {
          extensions: {
            code: 'AUTHENTICATION_FAILED'
          }
        })
      }

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
    },
    createUser: async (root, args) => {
      try {        
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        return user.save()
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: 'BAD_INPUT',
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username : args.username })

      if (!user || args.password !== 'salainen') {
        throw new GraphQLError('wrong username or password', {
          extensions: {
            code: 'AUTHENTICATION_FAILED'
          }
        })
      }

      const userToken = {
        username: user.username,
        id: user._id
      }

      const token = jwt.sign(userToken, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 })

      return { value : token }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers