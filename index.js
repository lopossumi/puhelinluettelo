const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function (req, res) {return req.body})
app.use(morgan((tokens, req, res) =>
    [
        tokens.method(req, res),
        tokens.url(req, res),
        JSON.stringify(tokens.body(req,res)),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
))

let persons = [
]

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name){
        return res.status(400).json({error: 'name missing'})
    }
    
    if (!body.number){
        return res.status(400).json({error: 'number missing'})
    }

    if (persons.find(item => item.name === body.name)){
        return res.status(400).json({error: 'name must be unique'})
    }
   
    const person = new Person({
        name: body.name,
        number: body.number || false
    })

    person
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    if (persons.find(item => item.id === id)) {
        const personObject = req.body
        personObject.id = id
        persons = persons.map(item => item.id !== id ? item : personObject)
        res.status(200).end()
    } else {
        res.status(404).end() 
    }

})

app.get('/', (req, res) => {
    res.sendfile('/build/index.html')
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(item => item.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.get('/info', (req,res) => {
    res.send(
        `Puhelinluettelossa ${persons.length} henkilön tiedot.<br/>${new Date()}`)
})

app.get('/api/persons', (req, res) => {
    console.log("trying to get persons...")
    Person
        .find({})
        .then(people => {
            res.json(people.map(Person.format))
        })
})

app.delete('/api/persons/:id', (req, res) =>{
    const id = Number(req.params.id)
    persons = persons.filter(item => item.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})