const mongoose = require('mongoose')
require('dotenv').config()

// Read MongoDB URI from environment variable and create schema for Person.
const url = process.env.MONGODB_URI
const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const argCount = process.argv.length - 2

const storePerson = (name, number) => {
    mongoose.connect(url)

    const person = new Person({
        name: name,
        number: number
    })

    person
        .save()
        .then(response => {
            console.log(response)
            console.log(`Henkilö ${name} tallennettu tietokantaan numerolla ${number}.`)
            mongoose.connection.close()
        })
}

const listPersons = () => {
    mongoose.connect(url)

    Person.find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}

// const formatPerson = (person) => {
//     return {
//         name:person.name,
//         number:person.number
//     }
// }

switch (true) {
case argCount === 0:
    listPersons()
    break
case argCount === 2:
    storePerson(process.argv[2], process.argv[3])
    break
default:
    console.log('wrong number of parameters.')
    break
}