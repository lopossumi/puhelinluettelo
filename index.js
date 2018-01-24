const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

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
    {
        id: 1,
        name: 'Mikki Hiiri',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Aku Ankka',
        number: '050-234567'
    },
    {
        id: 3,
        name: 'Roope Ankka',
        number: '0400-999999'
    },
    {
        id: 4,
        name: 'Hannu Hanhi',
        number: '040-7777777'
    }
]

const generateId = () => {
    return Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)
}

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
   
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number || false
    }
    persons = persons.concat(person)
    res.json(person)
})


app.get('/', (req, res) => {
    res.send('<h1>Hello from puhelinluettelo!</h1>')
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
    res.json(persons)
})

app.delete('/api/persons/:id', (req, res) =>{
    const id = Number(req.params.id)
    persons = persons.filter(item => item.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})