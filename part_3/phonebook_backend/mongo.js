require('dotenv').config()

const mongoose = require('mongoose')
const Contact = require('./models/contact')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose
  .connect(url, { family: 4 })
  .then((_result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

if (process.argv.length === 4) {
  const contact = new Contact({
    name: process.argv[2],
    number: process.argv[3],
  })
  contact.save().then(() => {
    console.log('new contact added!')
    mongoose.connection.close()
  })
} else {
  Contact.find({}).then((contacts) => {
    contacts.forEach((contact) => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}
