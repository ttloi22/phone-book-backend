import express from 'express'
import morgan from 'morgan'
import Person from './model/person.js'

const app = express()

morgan.token('body', req => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

app.get('/api/persons', async (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/info', async (req, res) => {
  try {
    const count = await Person.countDocuments({})
    res.send(`<p>Phone book has info for ${count} people</p><p>${Date()}</p>`)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching person count' })
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (!person) {
      return res.status(404).json({ error: 'Person not found' })
    }
    res.json(person)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body
  try {
    const person = new Person({
      name,
      number,
    })
    const savedPerson = await person.save()
    res.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  const { name, number } = req.body
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedPerson) {
      return res.status(404).json({ error: 'Person not found' })
    }

    res.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
