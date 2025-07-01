import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://trantienloi2404:${password}@cluster0.jejdene.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const phoneSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

if (process.argv.length === 3) {
  Phone.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  }).finally(() => process.exit(0))
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const newPhone = new Phone({ name, number })
  newPhone.save().then(() => {
    console.log(`added ${name} ${number} to phone book`)
    mongoose.connection.close()
  })
}
