require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name){
        return res.status(400).json({error: 'name missing'})
    }
    
    if (!body.number){
        return res.status(400).json({error: 'number missing'})
    }

    Person
        .find({name: body.name})
        .then(result => {
            if(result.length !== 0){
                return res.status(400).json({error: 'name must be unique'})
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number || false
                })
            
                person
                    .save()
                    .then(savedPerson => {
                        res.json(Person.format(savedPerson))
                    })
            }
        })
})

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    const person = {
        name:body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(id, person, {new:true})
        .then(updatedPerson =>{
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id'})
        })
})

app.get('/', (req, res) => {
    res.sendfile('/build/index.html')
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person
        .findById(id)
        .then(person => {
            if(person){
                res.json(Person.format(person))
            } else {
                res.status(404).end()    
            }
        })
        .catch(error => {
            console.log("error")
            res.status(400).send({error: 'malformatted id'})
        })
})

app.get('/info', (req,res) => {
    Person
        .find({})
        .then(people => {
            res.send(`Puhelinluettelossa ${people.length} henkilön tiedot.<br/>${new Date()}`)
        })
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
    const id = req.params.id

    Person
        .findByIdAndRemove(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({error: 'malformatted id'})
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})