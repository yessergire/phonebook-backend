if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()

const PORT = process.env.PORT || 3001

const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('json', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

const Person = require('./models/person')

app.get('/api/info', (request, response) => {
  Person.countDocuments().then((count) => {
    response.send(`Phonebook has info for ${count} people <br /> ${new Date()}`)
  })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons =>
      response.json(persons.map(person => person.toJSON()))
    )
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  console.log(request.body)
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })
  newPerson.save()
    .then(savedPerson => response.json(savedPerson.toJSON()))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then(person => response.json(person.toJSON()))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(r => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
