require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const connectToMongo = require('./mongo')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const typeDefs = `
   type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]! 
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
    title: String!
    author: String
    published: Int!
    genres: [String!]!
  ): Book!

    editAuthor(
    name: String!
    setBornTo: Int!
  ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
}
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (_, args) => {
      let filter = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }
      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})
      return authors.map(author => {
      const bookCount = books.filter(book => book.author.toString() === author._id.toString()).length
        return {
          ...author.toObject(),
          bookCount
        }
      })
    },
      me: (_, __, context) => {
      return context.currentUser
    }
  },

Mutation: {
      createUser: async (_, args) => {
      const user = new User({ ...args })
      try {
        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError('User creation failed: ' + error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username })
      if (!user || password !== 'password') {
        throw new GraphQLError('invalid password', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET)
      }
    },

  addBook: async (_, args, context,) => {
    if (!context.currentUser) {
    throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHORIZED' }
      })
    }
    let author = await Author.findOne({ name: args.author })

    if (!author) {
      try {
        author = new Author({ name: args.author })
        await author.save()
      } catch (error) {
        throw new GraphQLError('Author validation failed: ' + error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      }
    }

    try {
      const book = new Book({ ...args, author: author._id })
      await book.save()
      return book.populate('author')
    } catch (error) {
      throw new GraphQLError('Book validation failed: ' + error.message, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args,
          error
        }
      })
    } 
  },

editAuthor: async (_, args, context,) => {
    if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHORIZED' }
        })
      }
    const author = await Author.findOne({ name: args.name })
    if (!author) return null

    author.born = args.setBornTo

    try {
      await author.save()
      const books = await Book.find({ author: author._id })
      return {
        ...author.toObject(),
        bookCount: books.length
      }
    } catch (error) {
      throw new GraphQLError('Author update failed: ' + error.message, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args,
          error
        }
      })
    }
  }
}
}

const start = async () => {
  await connectToMongo()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  })

  const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
        } catch (e) {
        console.warn('Invalid token')
        }
      }
      return {}
    }
  })
  console.log(`Server ready at ${url}`)
}

start()