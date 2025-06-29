import express from 'express'
import morgan from 'morgan'

const app = express()

morgan.token('body', req => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const isExist = persons.findIndex(p => p.name === name)
  if (isExist !== -1) return res.status(400).json({ error: 'name must be unique' })
  const person = { id: Math.random() * 100 + 10, name, number }
  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
