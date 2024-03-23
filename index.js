require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Phonebook = require('./models/phonebook')

const app = express()

morgan.token('postData', (req,res) => { return JSON.stringify(req.body)})
const morganString = ':method :url :status :res[content-length] - :response-time ms :postData'

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(morganString))

app.get('/info', (req, res, next) => {
  const time = new Date(Date.now())

  Phonebook.find({})
    .then(p => {
      res.send(`<p>Phonebook has info for ${p.length} people</p><p>${time}</p>`)
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
  Phonebook.find({})
    .then(p => {
      res.json(p)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Phonebook.findById(id)
    .then(p => {
      res.json(p)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const person = {
    name: req.body.name,
    number: req.body.number
  }
  const settings = {
    new: true,
    runValidators: true,
    context: 'query'
  }

  Phonebook.findByIdAndUpdate(id, person, settings)
    .then(newPerson => {
      res.json(newPerson)
    })
    .catch(err => next(err))

})

app.delete('/api/persons/:id', (req, res, next) => {
  console.log(`Deleting person by id ${req.params.id}`)
  Phonebook.findByIdAndDelete(req.params.id)
    .then(person => {
      console.log('Deleting person', person.name)
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons/', (req,res, next) => {
  if(!('name' in req.body) || !('number' in req.body)) {
    return res.status(400).json({ error:'content missing' })
  }

  const person = new Phonebook({
    name: req.body.name,
    number: req.body.number
  })

  person.save()
    .then(results => {
      console.log(`added ${results.name} number ${results.number} to phonebook`)
      res.json(person)
    })
    .catch(err => {
      return next(err)
    })

})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (err, req, res, next) => {

  if(err.name === 'CastError')
  {
    return res.status(400).send({ error: 'malformed id' })
  }
  else if (err.name === 'ValidationError')
  {
    return res.status(400).send({ error: err.message })
  }


  console.log(err.message)
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})