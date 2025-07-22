const mongoose = require('mongoose')

const connectToMongo = async () => {
  const MONGODB_URI = process.env.MONGODB_URI

  console.log('Connecting to MongoDB...')

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectToMongo
