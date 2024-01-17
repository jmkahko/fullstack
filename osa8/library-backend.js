const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()
const User = require('./models/user')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const MONGODB_URI = process.env.MONGODB_URI
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

console.log('connecting to : ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB : ', error.message)
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()
  
  app.use('/', cors(), express.json(), expressMiddleware(server, {
    context: async ({ req }) => {
      const authorization = req ? req.headers.authorization : null
      if (authorization && authorization.startsWith('Bearer ')) {
        const token = jwt.verify(authorization.substring(7), process.env.TOKEN_SECRET)
        const validUser = await User.findById(token.id)

        return { validUser }
      }
    }
  }))

  const PORT = process.env.PORT
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`)
  })
}

start()