const express = require('express')
const app = express()

const notes = [
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
    
    res.send(`<p>Phonebook has info for ${notes.length} people</p><p>${time}</p>`)
})

app.get("/api/persons", (req, res) => {
    res.json(notes)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})