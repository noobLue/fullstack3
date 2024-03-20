const mongoose = require('mongoose')

if(process.argv.length < 3)
{
    console.log("missing password")
    process.exit()
}
else if (process.argv.length != 5 && process.argv.length != 3)
{
    console.log("invalid arguments")
    process.exit()
}

const password = process.argv[2]
const databaseName = "phonebookApp"

const url = `mongodb+srv://jontsa96:${password}@cluster0.hdj5ce5.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(process.argv.length == 5)
{
    const name = process.argv[3]
    const number = process.argv[4]
    
    const phone = new Phonebook({
        name,
        number
    })

    phone.save().then(results => {
        //console.log(results)
        console.log(`added ${results.name} number ${results.number} to phonebook`)
        mongoose.connection.close()
    })
}
else 
{
    Phonebook.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(r => {
            console.log(`${r.name} ${r.number}`)
        })
        mongoose.connection.close()
    })
}

/*
const note = new Note({
    content: "html is easy",
    important: true
})

note.save().then(result => {
    console.log("note saved")
    mongoose.connection.close()
})
*/
/*
Note.find({}).then(result => {
    result.forEach(r => {
        console.log(r)
    })
    mongoose.connection.close()
})
*/