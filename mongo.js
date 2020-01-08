const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const URL =
  `mongodb+srv://fullstack:${password}@cluster0-wnxwa.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(URL, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('Phonebook:')

    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })

    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response => {
    console.log(`added ${person.name} number ${person.number} to db`)
    mongoose.connection.close()
  })

} else {
  mongoose.connection.close()
}
