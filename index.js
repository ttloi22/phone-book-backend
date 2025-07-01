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
  Person.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/info', (req, res) => {
  res.send(`<p>Phone book has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params
  const person = persons.find(person => person.id === id)
  if (!person) return res.status(404).end()
  res.send(`<p>Name: ${person.name}</p><p>Number: ${person.number}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ message: 'content missing' })
  const person = new Person({
    name,
    number,
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
