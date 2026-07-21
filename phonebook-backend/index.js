require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist')) // Serve frontend production build (Exercise 3.11)
app.use(express.json())
app.use(cors()) // Enable cross-origin resource sharing (Exercise 3.9)

// Info Endpoint (Exercise 3.18*)
app.get('/info', (request, response, next) => {
  Person.find({})
   .then(persons => {
      const infoHtml = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      `
      response.send(infoHtml)
    })
   .catch(error => next(error))
})

// Fetch all entries (Exercise 3.13)
app.get('/api/persons', (request, response, next) => {
  Person.find({})
   .then(persons => {
      response.json(persons)
    })
   .catch(error => next(error))
})

// Fetch individual entry (Exercise 3.18*)
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

// Delete individual entry (Exercise 3.15)
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
   .then(() => {
      response.status(204).end()
    })
   .catch(error => next(error))
})

// Create new entry (Exercise 3.14)
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
   .then(savedPerson => {
      response.json(savedPerson)
    })
   .catch(error => next(error)) // Caught by validation handlers (3.19*/3.20*)
})

// Update existing entry (Exercise 3.17*)
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // runValidators activates Mongoose schema validation on updates
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
   .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
   .catch(error => next(error))
})

// Fallback for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Centralized Error Handling Middleware (Exercise 3.16)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})