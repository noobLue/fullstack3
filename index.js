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


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/info", (req, res) => {
    const time = new Date(Date.now());
    
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
})

app.get("/api/persons", (req, res) => {
    Phonebook.find({}).then(p => {
        res.json(p)
    })
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(note => note.id === id)
    
    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    /*
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
    */

    console.log(`Deleting person by id ${req.params.id}`)
    Phonebook.findByIdAndDelete(req.params.id)
    .then(person => {
        console.log(`Deleting person`, person)
        res.status(204).end()
    })
    .catch(error => {
        console.log(error)
    })
})

app.post("/api/persons/", (req,res) => {
    if(!('name' in req.body) || !('number' in req.body)) {
        return res.status(400).json({error:'content missing'})
    }

    const person = new Phonebook({
        name: req.body.name,
        number: req.body.number
    })

    person.save().then(results => {
        /*
        if(persons.filter(p => p.name === person.name).length > 0) {
            return res.status(400).json({error:'name already exists'})
        }
        */
        console.log(`added ${results.name} number ${results.number} to phonebook`)
        res.json(person)
    })
    
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})