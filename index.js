const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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