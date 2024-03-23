const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connnecting to ', url)

mongoose.connect(url)
  .then(res => {
    console.log('Connected to mongodb')
  })
  .catch(err => {
    console.log('We had an error', err.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: p => `${p.value} is not a proper phonenumber`
    }
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id,
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)