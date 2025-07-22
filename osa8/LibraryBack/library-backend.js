require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const connectToMongo = require('./mongo')
const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')

const typeDefs = `
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
    }
  },

Mutation: {
  addBook: async (_, args) => {
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

editAuthor: async (_, args) => {
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
    resolvers
  })
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })
  console.log(`Server ready at ${url}`)
}

start()