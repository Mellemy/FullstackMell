const mongoose = require('mongoose')


mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

const numberValidator = (value) => {
  return /^\d{2,3}-\d+$/.test(value)
}

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minlength: [8, 'Phone number must be at least 8 characters long'],
    validate: {
      validator: numberValidator,
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)
