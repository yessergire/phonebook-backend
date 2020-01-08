const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people <br /> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 1000000000)
    const newPerson = request.body

    if (!newPerson)
        return response.status(400).json({ error: 'data missing' })

    if (!newPerson.name)
        return response.status(400).json({ error: 'name missing' })

    if (!newPerson.number)
        return response.status(400).json({ error: 'number missing' })

    const isNameFree = persons.every(person => person.name !== newPerson.name)
    if (!isNameFree)
        return response.status(400).json({ error: 'name must be unique' })

    persons = persons.concat({id: id, ...newPerson})
    response.json(newPerson)
})

// Method: DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
