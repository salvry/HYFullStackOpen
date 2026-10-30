require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
morgan.token('data', function (req, _res) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
)
app.use(express.static('dist'))

const Contact = require('./models/contact')

app.get('/api/persons', (_request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts)
  })
})

app.get('/info', (_request, response) => {
  Contact.countDocuments({}).then((count) => {
    const info =
      count === 1
        ? `Phonebook has info for ${count} person`
        : `Phonebook has info for ${count} people`

    response.send(`<p>${info}</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((_result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((person) => {
      if (person) {
        person.name = request.body.name
        person.number = request.body.number
        return person.save().then((updatedPerson) => {
          response.json(updatedPerson)
        })
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'Name or number missing',
    })
  }
  const newContact = new Contact({
    name: request.body.name,
    number: request.body.number,
  })
  newContact
    .save()
    .then((savedContact) => {
      response.json(savedContact)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, _request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'id format not correct' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
