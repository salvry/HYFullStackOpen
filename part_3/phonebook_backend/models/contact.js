require('dotenv').config()

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /(\d{2}-\d{6,})|(\d{3}-\d{5,})/.test(v)
      },
    },
  },
})

const Contact = mongoose.model('Contact', contactSchema)

contactSchema.set('toJSON', {
  transform: (document, contact) => {
    contact.id = contact._id.toString()
    delete contact._id
    delete contact.__v
  },
})

module.exports = mongoose.model('Contact', contactSchema)
