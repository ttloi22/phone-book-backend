import mongoose from 'mongoose'
import 'dotenv/config'
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose
  .connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 3, unique: true },
  number: {
    type: String, validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v) && v.length > 8
      },
      message: 'Phone number must be in the format 123-4567890 or 12-34567890'
    }
  },
})

const Phone = mongoose.model('Phone', phoneSchema)

phoneSchema.set('toJSON', { 
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default Phone
